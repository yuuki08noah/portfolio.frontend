<template>
  <div class="resume-ticket">
    <div class="ticket-header">
      <div class="ticket-brand">PORTFOLIO TICKET</div>
      <div class="ticket-id">NO. {{ ticketId }}</div>
    </div>
    
    <div class="ticket-body">
      <div class="ticket-main">
        <h1 class="ticket-name">{{ profile.name }}</h1>
        <p class="ticket-role">{{ profile.tagline }}</p>
        
        <div class="ticket-section">
          <h3>Profile</h3>
          <p>{{ profile.bio }}</p>
        </div>
        
        <div class="ticket-section">
          <h3>Experience</h3>
          <div v-for="milestone in experience" :key="milestone.id" class="ticket-item">
            <div class="item-header">
              <span class="item-title">{{ milestone.title }}</span>
              <span class="item-date">{{ milestone.period }}</span>
            </div>
            <div class="item-org">{{ milestone.organization }}</div>
          </div>
        </div>
      </div>
      
      <div class="ticket-sidebar">
        <div class="ticket-section">
          <h3>Skills</h3>
          <ul class="ticket-skills">
            <li v-for="skill in profile.skills" :key="skill">{{ skill }}</li>
          </ul>
        </div>
        
        <div class="ticket-section">
          <h3>Contact</h3>
          <ul class="ticket-contact">
            <li v-for="link in links" :key="link.name">
              {{ link.name }}: {{ link.url.replace('mailto:', '').replace('https://', '') }}
            </li>
          </ul>
        </div>
        
        <div class="ticket-qr">
          <!-- Placeholder for QR Code -->
          <div class="qr-placeholder">
            <span>ADMIT ONE</span>
          </div>
        </div>
      </div>
    </div>
    
    <div class="ticket-footer">
      <div class="ticket-date">ISSUED: {{ currentDate }}</div>
      <div class="ticket-signature">Authorized Signature</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { profileData, milestones, externalLinks } from '~/data/portfolio'

const profile = profileData
const links = externalLinks
const experience = milestones.filter(m => m.type === 'experience')
const education = milestones.filter(m => m.type === 'education')

const ticketId = Math.floor(Math.random() * 1000000).toString().padStart(6, '0')
const currentDate = new Date().toLocaleDateString('en-US', { 
  year: 'numeric', month: 'long', day: 'numeric' 
}).toUpperCase()
</script>

<style scoped>
.resume-ticket {
  background: #fdfbf7; /* Warm paper color */
  color: #1a1a1a;
  padding: 40px;
  max-width: 800px;
  margin: 0 auto;
  border: 2px solid #1a1a1a;
  font-family: 'Georgia', serif;
  position: relative;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
}

/* Print Styles - These will apply when printing */
@media print {
  .resume-ticket {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 40px;
    border: none;
    box-shadow: none;
    z-index: 9999;
    background: white;
  }
}

.ticket-header {
  display: flex;
  justify-content: space-between;
  border-bottom: 4px double #1a1a1a;
  padding-bottom: 20px;
  margin-bottom: 30px;
}

.ticket-brand {
  font-family: 'Inter', sans-serif;
  font-weight: 900;
  letter-spacing: 0.2em;
  font-size: 1.2rem;
}

.ticket-id {
  font-family: 'Courier New', monospace;
  font-weight: 700;
  letter-spacing: 0.1em;
}

.ticket-body {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 40px;
}

.ticket-name {
  font-size: 3rem;
  margin: 0 0 10px 0;
  line-height: 1;
  text-transform: uppercase;
  letter-spacing: -0.02em;
}

.ticket-role {
  font-family: 'Inter', sans-serif;
  font-size: 1rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #666;
  margin-bottom: 40px;
  border-bottom: 1px solid #ccc;
  padding-bottom: 20px;
}

.ticket-section {
  margin-bottom: 30px;
}

.ticket-section h3 {
  font-family: 'Inter', sans-serif;
  font-size: 0.9rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  border-bottom: 2px solid #1a1a1a;
  padding-bottom: 5px;
  margin-bottom: 15px;
}

.ticket-item {
  margin-bottom: 15px;
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 4px;
}

.item-title {
  font-weight: 700;
  font-size: 1.1rem;
}

.item-date {
  font-family: 'Inter', sans-serif;
  font-size: 0.8rem;
  color: #666;
}

.item-org {
  font-style: italic;
  color: #444;
}

.ticket-skills, .ticket-contact {
  list-style: none;
  padding: 0;
  margin: 0;
}

.ticket-skills li, .ticket-contact li {
  margin-bottom: 8px;
  font-size: 0.95rem;
  line-height: 1.4;
}

.ticket-footer {
  margin-top: 40px;
  padding-top: 20px;
  border-top: 4px double #1a1a1a;
  display: flex;
  justify-content: space-between;
  font-family: 'Courier New', monospace;
  font-size: 0.9rem;
}

.qr-placeholder {
  width: 100%;
  aspect-ratio: 1;
  border: 2px solid #1a1a1a;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
  background: repeating-linear-gradient(
    45deg,
    #f0f0f0,
    #f0f0f0 10px,
    #e0e0e0 10px,
    #e0e0e0 20px
  );
}

.qr-placeholder span {
  background: #1a1a1a;
  color: white;
  padding: 5px 10px;
  font-weight: 700;
  font-family: 'Inter', sans-serif;
  font-size: 0.8rem;
}
</style>
