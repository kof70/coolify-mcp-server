#!/usr/bin/env node
/**
 * Script de test complet de l'API Coolify
 * Teste tous les endpoints et génère un rapport détaillé
 * 
 * Usage: node scripts/test-coolify-api.mjs
 */

import axios from 'axios';
import fs from 'fs';
import { config } from 'dotenv';

// Charger les variables d'environnement depuis .env
config();

class CoolifyAPITester {
  constructor() {
    this.baseUrl = process.env.COOLIFY_BASE_URL || '';
    const token = process.env.COOLIFY_TOKEN || '';

    if (!this.baseUrl || !token) {
      console.error('❌ COOLIFY_BASE_URL et COOLIFY_TOKEN sont requis');
      console.error('   Définissez-les dans votre environnement ou fichier .env');
      process.exit(1);
    }

    this.client = axios.create({
      baseURL: `${this.baseUrl.replace(/\/$/, '')}/api/v1`,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      timeout: 30000,
      validateStatus: () => true,
    });

    this.results = [];
  }

  async testEndpoint(name, method, endpoint, data = null) {
    const start = Date.now();
    
    try {
      const response = method === 'GET' 
        ? await this.client.get(endpoint)
        : await this.client.post(endpoint, data);
      
      const duration = Date.now() - start;
      const statusCode = response.status;

      let status = 'success';
      if (statusCode === 404) status = 'not_found';
      else if (statusCode === 401 || statusCode === 403) status = 'unauthorized';
      else if (statusCode >= 500) status = 'server_error';
      else if (statusCode >= 400) status = 'error';

      return {
        name,
        endpoint: `${method} ${endpoint}`,
        method,
        status,
        statusCode,
        response: response.data,
        duration,
      };
    } catch (error) {
      const duration = Date.now() - start;
      
      return {
        name,
        endpoint: `${method} ${endpoint}`,
        method,
        status: 'error',
        statusCode: error.response?.status,
        error: error.message,
        duration,
      };
    }
  }

  async runAllTests() {
    console.log('🚀 Démarrage des tests de l\'API Coolify...\n');
    console.log(`📍 URL: ${this.baseUrl}`);
    console.log('─'.repeat(60));

    const endpoints = [
      // Version & Health
      { name: 'Version', method: 'GET', path: '/version' },
      { name: 'Health Check', method: 'GET', path: '/health' },
      
      // Teams
      { name: 'List Teams', method: 'GET', path: '/teams' },
      { name: 'Current Team', method: 'GET', path: '/teams/current' },
      { name: 'Current Team Members', method: 'GET', path: '/teams/current/members' },
      
      // Servers
      { name: 'List Servers', method: 'GET', path: '/servers' },
      
      // Projects
      { name: 'List Projects', method: 'GET', path: '/projects' },
      
      // Applications
      { name: 'List Applications', method: 'GET', path: '/applications' },
      
      // Services
      { name: 'List Services', method: 'GET', path: '/services' },
      
      // Databases
      { name: 'List Databases', method: 'GET', path: '/databases' },
      
      // Deployments
      { name: 'List Deployments', method: 'GET', path: '/deployments' },
      
      // Private Keys - tester plusieurs variantes
      { name: 'Security Keys', method: 'GET', path: '/security/keys' },
      { name: 'Keys (alt)', method: 'GET', path: '/keys' },
      { name: 'Private Keys (alt)', method: 'GET', path: '/private-keys' },
      
      // Autres endpoints potentiels
      { name: 'API Root', method: 'GET', path: '/' },
    ];

    for (const ep of endpoints) {
      process.stdout.write(`Testing ${ep.name.padEnd(25)}... `);
      const result = await this.testEndpoint(ep.name, ep.method, ep.path);
      this.results.push(result);
      
      const icon = result.status === 'success' ? '✅' : 
                   result.status === 'not_found' ? '❓' :
                   result.status === 'unauthorized' ? '🔒' : '❌';
      console.log(`${icon} ${result.statusCode || 'N/A'} (${result.duration}ms)`);
    }

    const versionResult = this.results.find(r => r.endpoint.includes('/version'));
    const version = typeof versionResult?.response === 'string' 
      ? versionResult.response 
      : versionResult?.response?.version || 'unknown';

    return {
      timestamp: new Date().toISOString(),
      coolifyVersion: String(version),
      baseUrl: this.baseUrl,
      totalTests: this.results.length,
      passed: this.results.filter(r => r.status === 'success').length,
      failed: this.results.filter(r => r.status !== 'success' && r.status !== 'not_found').length,
      notFound: this.results.filter(r => r.status === 'not_found').length,
      results: this.results,
    };
  }

  printReport(report) {
    console.log('\n' + '═'.repeat(60));
    console.log('📊 RAPPORT DE TEST API COOLIFY');
    console.log('═'.repeat(60));
    console.log(`📅 Date: ${report.timestamp}`);
    console.log(`🏷️  Version Coolify: ${report.coolifyVersion}`);
    console.log(`🌐 URL: ${report.baseUrl}`);
    console.log('─'.repeat(60));
    console.log(`✅ Réussis: ${report.passed}/${report.totalTests}`);
    console.log(`❌ Échoués: ${report.failed}/${report.totalTests}`);
    console.log(`❓ Non trouvés: ${report.notFound}/${report.totalTests}`);
    console.log('─'.repeat(60));

    const byStatus = {
      success: report.results.filter(r => r.status === 'success'),
      not_found: report.results.filter(r => r.status === 'not_found'),
      error: report.results.filter(r => r.status === 'error' || r.status === 'server_error'),
      unauthorized: report.results.filter(r => r.status === 'unauthorized'),
    };

    if (byStatus.success.length > 0) {
      console.log('\n✅ ENDPOINTS FONCTIONNELS:');
      byStatus.success.forEach(r => {
        console.log(`   ${r.name.padEnd(25)} ${r.endpoint.padEnd(30)} → ${r.statusCode}`);
      });
    }

    if (byStatus.not_found.length > 0) {
      console.log('\n❓ ENDPOINTS NON TROUVÉS (404):');
      byStatus.not_found.forEach(r => {
        console.log(`   ${r.name.padEnd(25)} ${r.endpoint}`);
      });
    }

    if (byStatus.error.length > 0) {
      console.log('\n❌ ENDPOINTS EN ERREUR:');
      byStatus.error.forEach(r => {
        console.log(`   ${r.name.padEnd(25)} ${r.endpoint} → ${r.statusCode}`);
        if (r.error) console.log(`      Error: ${r.error}`);
      });
    }

    if (byStatus.unauthorized.length > 0) {
      console.log('\n🔒 ENDPOINTS NON AUTORISÉS:');
      byStatus.unauthorized.forEach(r => {
        console.log(`   ${r.name.padEnd(25)} ${r.endpoint} → ${r.statusCode}`);
      });
    }

    // Afficher les réponses
    console.log('\n' + '═'.repeat(60));
    console.log('📦 RÉPONSES DES ENDPOINTS FONCTIONNELS:');
    console.log('═'.repeat(60));
    
    byStatus.success.forEach(r => {
      console.log(`\n─── ${r.name} (${r.endpoint}) ───`);
      const jsonStr = JSON.stringify(r.response, null, 2);
      if (jsonStr.length > 1000) {
        console.log(jsonStr.substring(0, 1000) + '\n... (tronqué)');
      } else {
        console.log(jsonStr);
      }
    });
  }
}

async function main() {
  const tester = new CoolifyAPITester();
  const report = await tester.runAllTests();
  tester.printReport(report);
  
  const reportPath = 'coolify-api-test-report.json';
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log(`\n💾 Rapport complet sauvegardé: ${reportPath}`);
}

main().catch(console.error);
