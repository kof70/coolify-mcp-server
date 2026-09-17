import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { CoolifyConfig } from './types.js';

export interface CoolifyAccount extends CoolifyConfig {
  name: string;
}

interface AccountsFile {
  default?: string;
  accounts: CoolifyAccount[];
}

function accountsFilePath(): string {
  return (
    process.env.COOLIFY_ACCOUNTS_FILE ||
    path.join(os.homedir(), '.config', 'coolify-mcp', 'accounts.json')
  );
}

/**
 * Plusieurs comptes/teams Coolify (potentiellement sur des instances
 * différentes) gérés en un seul serveur MCP : fichier local
 * ~/.config/coolify-mcp/accounts.json (jamais commité, mode 0600), plus le
 * compte "env" dérivé des variables d'environnement historiques
 * (COOLIFY_BASE_URL/COOLIFY_TOKEN) pour rester compatible avec une config
 * mono-compte existante sans fichier.
 */
export class AccountsManager {
  private accounts: CoolifyAccount[] = [];
  private defaultName: string | undefined;
  private readonly filePath: string;

  constructor() {
    this.filePath = accountsFilePath();
    this.load();
  }

  private load(): void {
    try {
      const raw = fs.readFileSync(this.filePath, 'utf-8');
      const parsed = JSON.parse(raw) as AccountsFile;
      this.accounts = parsed.accounts || [];
      this.defaultName = parsed.default;
    } catch {
      this.accounts = [];
    }

    const envBaseUrl = process.env.COOLIFY_BASE_URL || process.env.COOLIFY_API_URL;
    const envToken = process.env.COOLIFY_TOKEN || process.env.COOLIFY_API_TOKEN;
    if (envBaseUrl && envToken && !this.accounts.some((a) => a.name === 'env')) {
      this.accounts.push({
        name: 'env',
        baseUrl: envBaseUrl,
        token: envToken,
        teamId: process.env.COOLIFY_TEAM_ID
      });
    }

    if (!this.defaultName) {
      this.defaultName = process.env.COOLIFY_ACTIVE_ACCOUNT || this.accounts[0]?.name;
    }
  }

  private persist(): void {
    fs.mkdirSync(path.dirname(this.filePath), { recursive: true });
    const toSave: AccountsFile = {
      default: this.defaultName,
      // "env" est dérivé des variables d'environnement à chaque démarrage,
      // jamais écrit sur disque pour éviter une double source de vérité.
      accounts: this.accounts.filter((a) => a.name !== 'env')
    };
    fs.writeFileSync(this.filePath, JSON.stringify(toSave, null, 2), { mode: 0o600 });
  }

  list(): Array<{ name: string; baseUrl: string; teamId?: string; tokenPreview: string }> {
    return this.accounts.map((a) => ({
      name: a.name,
      baseUrl: a.baseUrl,
      teamId: a.teamId,
      tokenPreview: a.token.length > 6 ? `${a.token.slice(0, 6)}…` : '…'
    }));
  }

  get(name: string): CoolifyAccount | undefined {
    return this.accounts.find((a) => a.name === name);
  }

  getDefaultName(): string | undefined {
    return this.defaultName;
  }

  setDefault(name: string): void {
    this.defaultName = name;
    this.persist();
  }

  /** Crée ou remplace un compte nommé, puis le persiste sur disque. */
  upsert(account: CoolifyAccount): void {
    const idx = this.accounts.findIndex((a) => a.name === account.name);
    if (idx >= 0) {
      this.accounts[idx] = account;
    } else {
      this.accounts.push(account);
    }
    this.persist();
  }
}
