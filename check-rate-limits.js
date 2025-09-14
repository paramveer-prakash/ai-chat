#!/usr/bin/env node

/**
 * Simple script to check your current rate limit status
 * Run this to see your current usage before trying to create new conversations
 */

const axios = require('axios');

const BASE_URL = 'http://localhost:8080';

async function checkRateLimits() {
  try {
    console.log('🔍 Checking rate limit status...\n');
    
    // You'll need to get your JWT token from browser localStorage
    console.log('📝 To get your token:');
    console.log('1. Open browser dev tools (F12)');
    console.log('2. Go to Application > Local Storage > http://localhost:3000');
    console.log('3. Find "auth-store" and copy the access_token value');
    console.log('4. Run: TOKEN="your_token_here" node check-rate-limits.js\n');
    
    const token = process.env.TOKEN;
    if (!token) {
      console.log('❌ No TOKEN environment variable found. Please set it first.');
      process.exit(1);
    }
    
    const headers = { Authorization: `Bearer ${token}` };
    
    // Check rate limit status
    const rateLimitResponse = await axios.get(`${BASE_URL}/api/v1/ai/rate-limit-status`, { headers });
    const rateLimits = rateLimitResponse.data;
    
    console.log('📊 Current Rate Limit Status:');
    console.log(`   Daily Requests: ${rateLimits.currentRequests}/${rateLimits.dailyRequestLimit}`);
    console.log(`   Daily Tokens: ${rateLimits.currentTokens}/${rateLimits.dailyTokenLimit}`);
    console.log(`   Active Conversations: ${rateLimits.activeConversations}/${rateLimits.maxActiveConversations}`);
    
    // Check conversations
    console.log('\n💬 Checking conversations...');
    const conversationsResponse = await axios.get(`${BASE_URL}/api/v1/ai/conversations`, { headers });
    const conversations = conversationsResponse.data.content;
    
    const activeConversations = conversations.filter(c => c.status === 'ACTIVE');
    const archivedConversations = conversations.filter(c => c.status === 'ARCHIVED');
    
    console.log(`   Total conversations: ${conversations.length}`);
    console.log(`   Active conversations: ${activeConversations.length}`);
    console.log(`   Archived conversations: ${archivedConversations.length}`);
    
    if (activeConversations.length >= 8) {
      console.log('\n⚠️  WARNING: You have many active conversations!');
      console.log('   Consider archiving some to avoid hitting the 10 conversation limit.');
    }
    
    if (activeConversations.length >= 10) {
      console.log('\n🚫 LIMIT REACHED: You have reached the maximum of 10 active conversations!');
      console.log('   You must archive or delete some conversations before creating new ones.');
      
      console.log('\n📋 Your active conversations:');
      activeConversations.forEach((conv, i) => {
        console.log(`   ${i + 1}. "${conv.title}" (${conv.messageCount} messages, ${conv.tokensUsed} tokens)`);
      });
    }
    
  } catch (error) {
    if (error.response?.status === 401) {
      console.log('❌ Authentication failed. Please check your token.');
    } else if (error.response?.status === 429) {
      console.log('❌ Rate limit exceeded! You need to wait before making more requests.');
    } else {
      console.log('❌ Error:', error.message);
    }
  }
}

checkRateLimits();
