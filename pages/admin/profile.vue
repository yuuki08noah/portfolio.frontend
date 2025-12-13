<template>
  <AdminLayout title="Profile" subtitle="Manage your portfolio profile with multi-language support">
    <LangTabs v-model="activeLang" />

    <div v-if="loading" class="placeholder">{{ t.loading }}</div>
    <div v-else-if="error" class="error-box">{{ error }}</div>

    <form v-else class="profile-form" @submit.prevent="handleSubmit">
      <!-- Profile Photo -->
      <div class="card">
        <div class="card-header">
          <h2>{{ t.profilePhoto }}</h2>
        </div>
        <div class="avatar-section">
          <div class="avatar-preview">
            <img v-if="avatarPreview || form.avatar_url" :src="avatarPreview || form.avatar_url" alt="Profile" />
            <div v-else class="avatar-placeholder">
              <span>{{ form.name?.charAt(0)?.toUpperCase() || '?' }}</span>
            </div>
          </div>
          <div class="avatar-actions">
            <input
              ref="avatarInput"
              type="file"
              accept="image/*"
              class="hidden-input"
              @change="handleAvatarChange"
            />
            <button type="button" class="btn ghost" @click="triggerAvatarUpload" :disabled="avatarUploading">
              {{ avatarUploading ? t.uploading : t.changePhoto }}
            </button>
            <button v-if="form.avatar_url" type="button" class="btn ghost danger" @click="removeAvatar" :disabled="avatarUploading">
              {{ t.removePhoto }}
            </button>
            <p class="avatar-hint">{{ t.photoHint }}</p>
          </div>
        </div>
      </div>
      <!-- Basic Info - English -->
      <div v-show="activeLang === 'en'" class="card">
        <div class="card-header">
          <h2>Basic Info (English)</h2>
        </div>
        <div class="form-grid">
          <div class="field">
            <label for="name">Name</label>
            <input id="name" v-model="form.name" type="text" required />
          </div>
          <div class="field">
            <label for="job_position">Job Position</label>
            <input id="job_position" v-model="form.job_position" type="text" placeholder="Full Stack Developer" />
          </div>
          <div class="field">
            <label for="tagline">Tagline</label>
            <input id="tagline" v-model="form.tagline" type="text" placeholder="DevOps Engineer | Cloud Infrastructure Specialist" />
          </div>
          <div class="field full-width">
            <label for="bio">Bio</label>
            <textarea id="bio" v-model="form.bio" rows="5" placeholder="Write your bio..."></textarea>
          </div>
        </div>
      </div>

      <!-- Basic Info - Korean -->
      <div v-show="activeLang === 'ko'" class="card">
        <div class="card-header">
          <h2>기본 정보 (한국어)</h2>
        </div>
        <div class="form-grid">
          <div class="field">
            <label for="name_ko">이름</label>
            <input id="name_ko" v-model="form.translations.ko.name" type="text" placeholder="홍길동" />
          </div>
          <div class="field">
            <label for="job_position_ko">직책</label>
            <input id="job_position_ko" v-model="form.translations.ko.job_position" type="text" placeholder="풀스택 개발자" />
          </div>
          <div class="field">
            <label for="tagline_ko">태그라인</label>
            <input id="tagline_ko" v-model="form.translations.ko.tagline" type="text" placeholder="데브옵스 엔지니어 | 클라우드 인프라 전문가" />
          </div>
          <div class="field full-width">
            <label for="bio_ko">소개 (Bio)</label>
            <textarea id="bio_ko" v-model="form.translations.ko.bio" rows="5" placeholder="자기소개를 작성하세요..."></textarea>
          </div>
        </div>
      </div>

      <!-- Location - English -->
      <div v-show="activeLang === 'en'" class="card">
        <div class="card-header">
          <h2>Location (English)</h2>
        </div>
        <div class="form-grid">
          <div class="field">
            <label for="location_country">Country</label>
            <input id="location_country" v-model="form.location_country" type="text" placeholder="Korea" />
          </div>
          <div class="field">
            <label for="location_city">City</label>
            <input id="location_city" v-model="form.location_city" type="text" placeholder="Seoul" />
          </div>
        </div>
      </div>

      <!-- Location - Korean -->
      <div v-show="activeLang === 'ko'" class="card">
        <div class="card-header">
          <h2>위치 (한국어)</h2>
        </div>
        <div class="form-grid">
          <div class="field">
            <label for="location_country_ko">국가</label>
            <input id="location_country_ko" v-model="form.translations.ko.location_country" type="text" placeholder="대한민국" />
          </div>
          <div class="field">
            <label for="location_city_ko">도시</label>
            <input id="location_city_ko" v-model="form.translations.ko.location_city" type="text" placeholder="서울" />
          </div>
        </div>
      </div>

      <!-- Basic Info - Japanese -->
      <div v-show="activeLang === 'ja'" class="card">
        <div class="card-header">
          <h2>基本情報 (日本語)</h2>
        </div>
        <div class="form-grid">
          <div class="field">
            <label for="name_ja">名前</label>
            <input id="name_ja" v-model="form.translations.ja.name" type="text" placeholder="山田太郎" />
          </div>
          <div class="field">
            <label for="job_position_ja">役職</label>
            <input id="job_position_ja" v-model="form.translations.ja.job_position" type="text" placeholder="フルスタックエンジニア" />
          </div>
          <div class="field">
            <label for="tagline_ja">タグライン</label>
            <input id="tagline_ja" v-model="form.translations.ja.tagline" type="text" placeholder="DevOpsエンジニア | クラウドインフラ専門家" />
          </div>
          <div class="field full-width">
            <label for="bio_ja">自己紹介</label>
            <textarea id="bio_ja" v-model="form.translations.ja.bio" rows="5" placeholder="自己紹介を書いてください..."></textarea>
          </div>
        </div>
      </div>

      <!-- Location - Japanese -->
      <div v-show="activeLang === 'ja'" class="card">
        <div class="card-header">
          <h2>所在地 (日本語)</h2>
        </div>
        <div class="form-grid">
          <div class="field">
            <label for="location_country_ja">国</label>
            <input id="location_country_ja" v-model="form.translations.ja.location_country" type="text" placeholder="韓国" />
          </div>
          <div class="field">
            <label for="location_city_ja">都市</label>
            <input id="location_city_ja" v-model="form.translations.ja.location_city" type="text" placeholder="ソウル" />
          </div>
        </div>
      </div>

      <!-- Contact Links (Same for all languages) -->
      <div class="card">
        <div class="card-header">
          <h2>{{ t.contactLinks }}</h2>
        </div>
        <div class="form-grid">
          <div class="field">
            <label for="contact_email">{{ t.email }}</label>
            <input id="contact_email" v-model="form.contact_email" type="email" placeholder="email@example.com" />
          </div>
          <div class="field">
            <label for="phone">{{ t.phone }}</label>
            <input id="phone" v-model="form.phone" type="tel" placeholder="010-1234-5678" />
          </div>
          <div class="field">
            <label for="github_url">GitHub URL</label>
            <input id="github_url" v-model="form.github_url" type="url" placeholder="https://github.com/username" />
          </div>
          <div class="field">
            <label for="linkedin_url">LinkedIn URL</label>
            <input id="linkedin_url" v-model="form.linkedin_url" type="url" placeholder="https://linkedin.com/in/username" />
          </div>
          <div class="field">
            <label for="website_url">{{ t.websiteUrl }}</label>
            <input id="website_url" v-model="form.website_url" type="url" placeholder="https://example.com" />
          </div>
        </div>
      </div>

      <!-- Skills (Same for all languages) -->
      <div class="card">
        <div class="card-header">
          <h2>{{ t.skills }}</h2>
          <button type="button" class="btn ghost small" @click="addSkill">{{ t.addSkill }}</button>
        </div>
        <div class="tags-list">
          <div v-for="(skill, index) in form.skills" :key="index" class="tag-item">
            <input v-model="form.skills[index]" type="text" placeholder="Skill" />
            <button type="button" class="btn-remove" @click="removeSkill(index)">×</button>
          </div>
        </div>
        <p v-if="!form.skills.length" class="muted">{{ t.addSkillPlaceholder }}</p>
      </div>

      <!-- Values -->
      <div class="card">
        <div class="card-header">
          <h2>{{ t.coreValues }}</h2>
          <button type="button" class="btn ghost small" @click="addValue">{{ t.addValue }}</button>
        </div>
        <div class="values-list">
          <div v-for="(value, index) in form.values" :key="index" class="value-item">
            <div class="field">
              <label :for="'value-title-' + index">{{ t.valueTitle }}</label>
              <input :id="'value-title-' + index" v-model="value.title" type="text" placeholder="Value Title" />
            </div>
            <div class="field">
              <label :for="'value-desc-' + index">{{ t.valueDesc }}</label>
              <textarea :id="'value-desc-' + index" v-model="value.description" rows="2" placeholder="Value Description"></textarea>
            </div>
            <button type="button" class="btn-remove" @click="removeValue(index)">×</button>
          </div>
        </div>
        <p v-if="!form.values.length" class="muted">{{ t.addValuePlaceholder }}</p>
      </div>

      <!-- External Links -->
      <div class="card">
        <div class="card-header">
          <h2>{{ t.externalLinks }}</h2>
          <button type="button" class="btn ghost small" @click="addExternalLink">{{ t.addLink }}</button>
        </div>
        <div class="links-list">
          <div v-for="(link, index) in form.external_links" :key="index" class="link-item">
            <div class="field">
              <label :for="'link-name-' + index">{{ t.linkName }}</label>
              <input :id="'link-name-' + index" v-model="link.name" type="text" placeholder="GitHub" />
            </div>
            <div class="field">
              <label :for="'link-url-' + index">URL</label>
              <input :id="'link-url-' + index" v-model="link.url" type="text" placeholder="https://..." />
            </div>
            <button type="button" class="btn-remove" @click="removeExternalLink(index)">×</button>
          </div>
        </div>
        <p v-if="!form.external_links.length" class="muted">{{ t.addLinkPlaceholder }}</p>
      </div>

      <!-- Certifications -->
      <div class="card">
        <div class="card-header">
          <h2>{{ t.certifications }}</h2>
          <button type="button" class="btn ghost small" @click="addCertification">{{ t.addCert }}</button>
        </div>
        <div class="links-list">
          <div v-for="(cert, index) in form.certifications" :key="index" class="link-item cert-item">
            <div class="field">
              <label :for="'cert-name-' + index">{{ t.certName }}</label>
              <input :id="'cert-name-' + index" v-model="cert.name" type="text" placeholder="AWS Solutions Architect" />
            </div>
            <div class="field">
              <label :for="'cert-issuer-' + index">{{ t.certIssuer }}</label>
              <input :id="'cert-issuer-' + index" v-model="cert.issuer" type="text" placeholder="Amazon Web Services" />
            </div>
            <div class="field">
              <label :for="'cert-date-' + index">{{ t.certDate }}</label>
              <input :id="'cert-date-' + index" v-model="cert.date" type="text" placeholder="2023-01" />
            </div>
            <div class="field">
              <label :for="'cert-url-' + index">{{ t.certUrl }}</label>
              <input :id="'cert-url-' + index" v-model="cert.url" type="text" placeholder="https://..." />
            </div>
            <button type="button" class="btn-remove" @click="removeCertification(index)">×</button>
          </div>
        </div>
        <p v-if="!form.certifications.length" class="muted">{{ t.addCertPlaceholder }}</p>
      </div>

      <!-- Awards - English -->
      <div v-show="activeLang === 'en'" class="card">
        <div class="card-header">
          <h2>{{ t.awards }} (English)</h2>
          <button type="button" class="btn ghost small" @click="addAward('en')">{{ t.addAward }}</button>
        </div>
        <div class="awards-list">
          <div v-for="(award, index) in form.awards.en.filter(a => !a._destroy)" :key="index" class="award-item">
            <div class="award-fields">
              <div class="field">
                <label :for="'award-name-' + index">{{ t.awardName }}</label>
                <input :id="'award-name-' + index" v-model="award.name" type="text" placeholder="Best Innovation Award" />
              </div>
              <div class="field">
                <label :for="'award-issuer-' + index">{{ t.awardIssuer }}</label>
                <input :id="'award-issuer-' + index" v-model="award.issuer" type="text" placeholder="Tech Conference 2024" />
              </div>
              <div class="field">
                <label :for="'award-date-' + index">{{ t.awardDate }}</label>
                <input :id="'award-date-' + index" v-model="award.date" type="text" placeholder="2024-03" />
              </div>
              <div class="field">
                <label :for="'award-url-' + index">{{ t.awardUrl }}</label>
                <input :id="'award-url-' + index" v-model="award.url" type="text" placeholder="https://..." />
              </div>
              <div class="field full-width">
                <label :for="'award-desc-' + index">{{ t.awardDescription }}</label>
                <textarea :id="'award-desc-' + index" v-model="award.description" rows="2" placeholder="Award description..."></textarea>
              </div>
            </div>
            <button type="button" class="btn-remove" @click="removeAward('en', index)">×</button>
          </div>
        </div>
        <p v-if="!form.awards.en.filter(a => !a._destroy).length" class="muted">{{ t.addAwardPlaceholder }}</p>
      </div>

      <!-- Awards - Korean -->
      <div v-show="activeLang === 'ko'" class="card">
        <div class="card-header">
          <h2>{{ t.awards }} (한국어)</h2>
          <button type="button" class="btn ghost small" @click="addAward('ko')">{{ t.addAward }}</button>
        </div>
        <div class="awards-list">
          <div v-for="(award, index) in form.awards.ko.filter(a => !a._destroy)" :key="index" class="award-item">
            <div class="award-fields">
              <div class="field">
                <label :for="'award-name-ko-' + index">수상명</label>
                <input :id="'award-name-ko-' + index" v-model="award.name" type="text" placeholder="최우수 혁신상" />
              </div>
              <div class="field">
                <label :for="'award-issuer-ko-' + index">수여기관</label>
                <input :id="'award-issuer-ko-' + index" v-model="award.issuer" type="text" placeholder="테크 컨퍼런스 2024" />
              </div>
              <div class="field">
                <label :for="'award-date-ko-' + index">수상일</label>
                <input :id="'award-date-ko-' + index" v-model="award.date" type="text" placeholder="2024-03" />
              </div>
              <div class="field">
                <label :for="'award-url-ko-' + index">URL (선택)</label>
                <input :id="'award-url-ko-' + index" v-model="award.url" type="text" placeholder="https://..." />
              </div>
              <div class="field full-width">
                <label :for="'award-desc-ko-' + index">설명</label>
                <textarea :id="'award-desc-ko-' + index" v-model="award.description" rows="2" placeholder="수상 설명..."></textarea>
              </div>
            </div>
            <button type="button" class="btn-remove" @click="removeAward('ko', index)">×</button>
          </div>
        </div>
        <p v-if="!form.awards.ko.filter(a => !a._destroy).length" class="muted">{{ t.addAwardPlaceholder }}</p>
      </div>

      <!-- Awards - Japanese -->
      <div v-show="activeLang === 'ja'" class="card">
        <div class="card-header">
          <h2>{{ t.awards }} (日本語)</h2>
          <button type="button" class="btn ghost small" @click="addAward('ja')">{{ t.addAward }}</button>
        </div>
        <div class="awards-list">
          <div v-for="(award, index) in form.awards.ja.filter(a => !a._destroy)" :key="index" class="award-item">
            <div class="award-fields">
              <div class="field">
                <label :for="'award-name-ja-' + index">賞名</label>
                <input :id="'award-name-ja-' + index" v-model="award.name" type="text" placeholder="最優秀イノベーション賞" />
              </div>
              <div class="field">
                <label :for="'award-issuer-ja-' + index">授与機関</label>
                <input :id="'award-issuer-ja-' + index" v-model="award.issuer" type="text" placeholder="テックカンファレンス2024" />
              </div>
              <div class="field">
                <label :for="'award-date-ja-' + index">受賞日</label>
                <input :id="'award-date-ja-' + index" v-model="award.date" type="text" placeholder="2024-03" />
              </div>
              <div class="field">
                <label :for="'award-url-ja-' + index">URL (任意)</label>
                <input :id="'award-url-ja-' + index" v-model="award.url" type="text" placeholder="https://..." />
              </div>
              <div class="field full-width">
                <label :for="'award-desc-ja-' + index">説明</label>
                <textarea :id="'award-desc-ja-' + index" v-model="award.description" rows="2" placeholder="受賞説明..."></textarea>
              </div>
            </div>
            <button type="button" class="btn-remove" @click="removeAward('ja', index)">×</button>
          </div>
        </div>
        <p v-if="!form.awards.ja.filter(a => !a._destroy).length" class="muted">{{ t.addAwardPlaceholder }}</p>
      </div>

      <!-- Submit -->
      <div class="form-actions">
        <button type="submit" class="btn btn-primary" :disabled="saving">
          {{ saving ? t.saving : t.save }}
        </button>
        <p v-if="successMessage" class="success">{{ successMessage }}</p>
      </div>
    </form>
  </AdminLayout>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref, computed } from 'vue'
import { useApi } from '~/composables/useApi'
import AdminLayout from '~/components/admin/AdminLayout.vue'
import LangTabs from '~/components/admin/LangTabs.vue'

definePageMeta({
  middleware: ['admin'],
  ssr: true
})

// i18n labels
const i18n = {
  en: {
    loading: 'Loading...',
    saving: 'Saving...',
    save: 'Save',
    savedSuccess: 'Profile saved successfully.',
    loadError: 'Failed to load profile.',
    saveError: 'Failed to save.',
    profilePhoto: 'Profile Photo',
    changePhoto: 'Change Photo',
    removePhoto: 'Remove',
    uploading: 'Uploading...',
    photoHint: 'Recommended: Square image, at least 200x200px',
    uploadError: 'Failed to upload image',
    contactLinks: 'Contact & Links',
    email: 'Email',
    phone: 'Phone',
    websiteUrl: 'Website URL',
    skills: 'Skills',
    addSkill: '+ Add',
    addSkillPlaceholder: 'Add your skills.',
    coreValues: 'Core Values',
    addValue: '+ Add',
    addValuePlaceholder: 'Add your core values.',
    valueTitle: 'Title',
    valueDesc: 'Description',
    externalLinks: 'External Links',
    addLink: '+ Add',
    addLinkPlaceholder: 'Add external links.',
    linkName: 'Name',
    certifications: 'Certifications',
    addCert: '+ Add',
    addCertPlaceholder: 'Add your certifications.',
    certName: 'Name',
    certIssuer: 'Issuer',
    certDate: 'Date',
    certUrl: 'URL (Optional)',
    awards: 'Awards',
    addAward: '+ Add',
    addAwardPlaceholder: 'Add your awards.',
    awardName: 'Name',
    awardIssuer: 'Issuer',
    awardDate: 'Date',
    awardUrl: 'URL (Optional)',
    awardDescription: 'Description'
  },
  ko: {
    loading: '불러오는 중...',
    saving: '저장 중...',
    save: '저장',
    savedSuccess: '프로필이 저장되었습니다.',
    loadError: '프로필을 불러오는데 실패했습니다.',
    saveError: '저장에 실패했습니다.',
    profilePhoto: '프로필 사진',
    changePhoto: '사진 변경',
    removePhoto: '삭제',
    uploading: '업로드 중...',
    photoHint: '권장: 정사각형 이미지, 최소 200x200px',
    uploadError: '이미지 업로드에 실패했습니다',
    contactLinks: '연락처 및 링크',
    email: '이메일',
    phone: '전화번호',
    websiteUrl: '웹사이트 URL',
    skills: '기술 스택',
    addSkill: '+ 추가',
    addSkillPlaceholder: '스킬을 추가하세요.',
    coreValues: '핵심 가치',
    addValue: '+ 추가',
    addValuePlaceholder: '핵심 가치를 추가하세요.',
    valueTitle: '제목',
    valueDesc: '설명',
    externalLinks: '외부 링크',
    addLink: '+ 추가',
    addLinkPlaceholder: '외부 링크를 추가하세요.',
    linkName: '이름',
    certifications: '자격증',
    addCert: '+ 추가',
    addCertPlaceholder: '자격증을 추가하세요.',
    certName: '자격증명',
    certIssuer: '발급기관',
    certDate: '취득일',
    certUrl: 'URL (선택)',
    awards: '수상 내역',
    addAward: '+ 추가',
    addAwardPlaceholder: '수상 내역을 추가하세요.',
    awardName: '수상명',
    awardIssuer: '수여기관',
    awardDate: '수상일',
    awardUrl: 'URL (선택)',
    awardDescription: '설명'
  },
  ja: {
    loading: '読み込み中...',
    saving: '保存中...',
    save: '保存',
    savedSuccess: 'プロフィールが保存されました。',
    loadError: 'プロフィールの読み込みに失敗しました。',
    saveError: '保存に失敗しました。',
    profilePhoto: 'プロフィール写真',
    changePhoto: '写真を変更',
    removePhoto: '削除',
    uploading: 'アップロード中...',
    photoHint: '推奨: 正方形の画像、200x200px以上',
    uploadError: '画像のアップロードに失敗しました',
    contactLinks: '連絡先・リンク',
    email: 'メールアドレス',
    phone: '電話番号',
    websiteUrl: 'ウェブサイトURL',
    skills: 'スキル',
    addSkill: '+ 追加',
    addSkillPlaceholder: 'スキルを追加してください。',
    coreValues: 'コアバリュー',
    addValue: '+ 追加',
    addValuePlaceholder: 'コアバリューを追加してください。',
    valueTitle: 'タイトル',
    valueDesc: '説明',
    externalLinks: '外部リンク',
    addLink: '+ 追加',
    addLinkPlaceholder: '外部リンクを追加してください。',
    linkName: '名前',
    certifications: '資格',
    addCert: '+ 追加',
    addCertPlaceholder: '資格を追加してください。',
    certName: '資格名',
    certIssuer: '発行機関',
    certDate: '取得日',
    certUrl: 'URL (任意)',
    awards: '受賞歴',
    addAward: '+ 追加',
    addAwardPlaceholder: '受賞歴を追加してください。',
    awardName: '賞名',
    awardIssuer: '授与機関',
    awardDate: '受賞日',
    awardUrl: 'URL (任意)',
    awardDescription: '説明'
  }
}

const t = computed(() => i18n[activeLang.value])

interface ProfileValue {
  title: string
  description: string
}

interface ExternalLink {
  name: string
  url: string
  icon?: string
}

interface ProfileTranslations {
  ko: {
    name: string
    bio: string
    tagline: string
    job_position: string
    location_city: string
    location_country: string
  }
  ja: {
    name: string
    bio: string
    tagline: string
    job_position: string
    location_city: string
    location_country: string
  }
}

interface Certification {
  name: string
  issuer: string
  date: string
  url?: string
}

interface Award {
  id?: number
  name: string
  issuer: string
  date: string
  url?: string
  description?: string
  _destroy?: boolean
}

interface ProfileForm {
  name: string
  tagline: string
  bio: string
  job_position: string
  location_country: string
  location_city: string
  contact_email: string
  phone: string
  github_url: string
  linkedin_url: string
  website_url: string
  avatar_url: string
  skills: string[]
  values: ProfileValue[]
  external_links: ExternalLink[]
  certifications: Certification[]
  awards: {
    en: Award[]
    ko: Award[]
    ja: Award[]
  }
  translations: ProfileTranslations
}

const { get, put, post, del } = useApi()
const config = useRuntimeConfig()

const activeLang = ref<'en' | 'ko' | 'ja'>('en')
const loading = ref(false)
const saving = ref(false)
const error = ref('')
const successMessage = ref('')
const avatarPreview = ref<string | null>(null)
const avatarInput = ref<HTMLInputElement | null>(null)
const avatarUploading = ref(false)

const form = reactive<ProfileForm>({
  name: '',
  tagline: '',
  bio: '',
  job_position: '',
  location_country: '',
  location_city: '',
  contact_email: '',
  phone: '',
  github_url: '',
  linkedin_url: '',
  website_url: '',
  avatar_url: '',
  skills: [],
  values: [],
  external_links: [],
  certifications: [],
  awards: {
    en: [],
    ko: [],
    ja: []
  },
  translations: {
    ko: {
      name: '',
      bio: '',
      tagline: '',
      job_position: '',
      location_city: '',
      location_country: ''
    },
    ja: {
      name: '',
      bio: '',
      tagline: '',
      job_position: '',
      location_city: '',
      location_country: ''
    }
  }
})

const handleAvatarChange = async (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files && input.files[0]) {
    const file = input.files[0]
    const reader = new FileReader()
    reader.onload = (e) => {
      avatarPreview.value = e.target?.result as string
    }
    reader.readAsDataURL(file)
    // Upload
    avatarUploading.value = true
    try {
      const formData = new FormData()
      formData.append('file', file)
      
      const response = await post<{ url: string }>('/api/v1/uploads', formData)
      if (response && response.url) {
        form.avatar_url = response.url
      }
    } catch (e) {
      console.error(e)
      alert(i18n[activeLang.value]?.uploadError || 'Upload failed')
    } finally {
      avatarUploading.value = false
    }
  }
}

const triggerAvatarUpload = () => {
  avatarInput.value?.click()
}

const removeAvatar = () => {
  form.avatar_url = ''
  avatarPreview.value = null
}

const loadProfile = async () => {
  loading.value = true
  error.value = ''
  try {
    const data = await get<{ profile: any }>('/api/v1/portfolio/profile')
    if (data && data.profile) {
      const p = data.profile
      form.name = p.name || ''
      form.tagline = p.tagline || ''
      form.bio = p.bio || ''
      form.job_position = p.job_position || ''
      form.location_country = p.location_country || ''
      form.location_city = p.location_city || ''
      form.contact_email = p.email || ''
      form.phone = p.phone || ''
      form.github_url = p.github_url || ''
      form.linkedin_url = p.linkedin_url || ''
      form.website_url = p.website_url || ''
      form.avatar_url = p.avatar_url || ''
      form.skills = p.skills || []
      form.values = p.values || []
      form.external_links = p.external_links || []
      form.certifications = p.certifications || []
      
      if (p.translations) {
        if (p.translations.ko) Object.assign(form.translations.ko, p.translations.ko)
        if (p.translations.ja) Object.assign(form.translations.ja, p.translations.ja)
      }

      if (p.awards) {
        form.awards.en = p.awards.map((a: any) => ({
          id: a.id,
          name: a.name,
          issuer: a.issuer,
          date: a.date,
          url: a.url,
          description: a.description,
          _destroy: false
        }))
        form.awards.ko = p.awards.map((a: any) => ({
          id: a.id,
          name: a.translations?.ko?.title || '', 
          issuer: a.translations?.ko?.organization || '',
          date: a.date,
          url: a.url,
          description: a.translations?.ko?.description || '',
          _destroy: false
        }))
        form.awards.ja = p.awards.map((a: any) => ({
          id: a.id,
          name: a.translations?.ja?.title || '', 
          issuer: a.translations?.ja?.organization || '',
          date: a.date,
          url: a.url,
          description: a.translations?.ja?.description || '',
          _destroy: false
        }))
      }
    }
  } catch (e) {
    console.error(e)
    error.value = i18n[activeLang.value].loadError
  } finally {
    loading.value = false
  }
}

const handleSubmit = async () => {
  saving.value = true
  successMessage.value = ''
  error.value = ''
  try {
    // 1. Save Profile (excluding awards)
    const { awards: _awards, ...profilePayload } = form
    // Remove awards from payload to avoid nested attributes conflict
    // Also remove any other fields not meant for profile update if necessary
    
    // We need to reconstruct the payload without 'awards' key, or set it to undefined/empty if backend ignores it
    // But since backend might still have accepts_nested_attributes_for, sending it empty might be safer or just removing it.
    // Let's create a clean payload.
    
    const payload = {
      ...profilePayload,
      awards_attributes: undefined // Ensure we don't send this
    }
    
    // Update Profile First
    await put('/api/v1/portfolio/profile', payload)
    
    // 2. Process Awards
    // Merge all awards from different language views to find unique awards by ID or new ones
    // Actually, 'form.awards' splits them by language view, but they reference the same objects? 
    // No, existing awards are mapped from response. New awards are objects created in frontend.
    
    // Let's collect all operations
    const operations: (() => Promise<any>)[] = []
    
    // Helper to process awards from a list
    const processAwardsList = (list: Award[], lang: 'en' | 'ko' | 'ja') => {
      for (const award of list) {
        if (award._destroy && award.id) {
          // Delete existing (only need to do once)
           // Check if already queued for deletion to avoid duplicates if same award shown in multiple tabs (unlikely with current UI but good practice)
           // Actually UI shows separate lists. Wait, is it one list filtered?
           // The UI does `form.awards.en`, `form.awards.ko` etc. 
           // In `loadProfile`, they are split: `awards.filter(...)`.
           // So if I add an award in EN, it is ONLY in EN list.
           // If I add translation, I probably didn't implement "Link this EN award to KO". 
           // The current UI assumes "Awards in English" are independent? 
           // Wait, `loadProfile` logic:
           // en: `!ko.title && !ja.title` -> English only awards?
           // ko: `ko.title` -> Korean awards?
           
           // The previous logic seemed to try to separate them physically.
           // "English Awards" = Awards that have English title? or just base?
           // The Request said "Awards 추가할 때".
           // If user adds Award in "Korean" tab, it sends { translations: { ko: ... } }.
           
           // Strategy:
           // Iterate all lists.
           // If ID exists:
           //   If _destroy: DELETE /awards/:id
           //   Else: PUT /awards/:id (Update fields)
           // If No ID:
           //   POST /awards (Create new)
           
           if (award._destroy) {
             if (award.id) {
               operations.push(() => del(`/api/v1/portfolio/awards/${award.id}`))
             }
             continue
           }
           
           const awardData = {
             title: award.name,
             organization: award.issuer,
             date: award.date,
             badge_image: award.url,
             description: award.description,
             translations: {} as any
           }
           
           // If we are in 'ko' tab, these fields should go to translations.ko
           // But `award.name` is bound to `v-model="award.name"`.
           // If I created it in 'ko' tab, `award.name` holds the Korean name.
           // The base columns (title, organization) should probably be populated too or allowed to be empty?
           // Backend `Award` model has `translatable_fields :title...`. 
           // If I send `title` param, it sets the DB column.
           // If I send `translations: { ko: { title: ... } }`, it sets translation.
           
           // Logic correction:
           // When creating in 'ko' tab, we want to set `translations.ko`.
           // But we also need a 'base' record. 
           // Let's assume input in specific language tab targets that language.
           
           if (lang === 'en') {
             // Treat as base
             // No translations param needed for EN (base)
           } else {
             // It's a localized award entry
             awardData.translations[lang] = {
               title: award.name,
               organization: award.issuer,
               description: award.description
             }
             // We should also set base title/org to something? Or leave empty?
             // Rails model might enforce presence of base title?
             // `translatable.rb` doesn't enforce base presence usually, but `Award` model might.
             // `Award` has `translatable_fields`. 
             // If I create with ONLY ko translation, `title` column is null.
             // Is that allowed? `create_table "awards"` has `title`, `organization`. No `null: false`.
             // So it's fine.
           }
           
           if (award.id) {
             operations.push(() => put(`/api/v1/portfolio/awards/${award.id}`, awardData))
           } else {
             operations.push(() => post('/api/v1/portfolio/awards', awardData))
           }
        }
      }
    }
    
    processAwardsList(form.awards.en, 'en')
    processAwardsList(form.awards.ko, 'ko')
    processAwardsList(form.awards.ja, 'ja')
    
    // Execute all award operations
    await Promise.all(operations.map(op => op()))
    
    successMessage.value = i18n[activeLang.value].savedSuccess
    await loadProfile()
  } catch (e: unknown) {
    error.value = e instanceof Error ? e.message : i18n[activeLang.value].saveError
  } finally {
    saving.value = false
  }
}

// Skills
const addSkill = () => {
  form.skills.push('')
}

const removeSkill = (index: number) => {
  form.skills.splice(index, 1)
}

// Values
const addValue = () => {
  form.values.push({ title: '', description: '' })
}

const removeValue = (index: number) => {
  form.values.splice(index, 1)
}

// External Links
const addExternalLink = () => {
  form.external_links.push({ name: '', url: '' })
}

const removeExternalLink = (index: number) => {
  form.external_links.splice(index, 1)
}

// Certifications
const addCertification = () => {
  form.certifications.push({ name: '', issuer: '', date: '', url: '' })
}

const removeCertification = (index: number) => {
  form.certifications.splice(index, 1)
}

// Awards
const addAward = (lang: 'en' | 'ko' | 'ja') => {
  form.awards[lang].push({
    name: '',
    issuer: '',
    date: '',
    url: '',
    description: ''
  })
}

const removeAward = (lang: 'en' | 'ko' | 'ja', index: number) => {
  const award = form.awards[lang][index]
  if (!award) return
  if (award.id) {
    award._destroy = true
  } else {
    form.awards[lang].splice(index, 1)
  }
}

onMounted(loadProfile)
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Merriweather:wght@300;400;700&family=Inter:wght@400;500;600&display=swap');

.page-wrapper {
  background-color: #ffffff;
  min-height: 100vh;
  color: #1a1a1a;
  font-family: 'Merriweather', serif;
  padding: 80px 20px;
}

.content-container {
  max-width: 900px;
  margin: 0 auto;
}

/* Header */
.page-header {
  margin-bottom: 40px;
}

.header-top {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 20px;
}

.page-title {
  font-family: 'Playfair Display', serif;
  font-size: 3rem;
  font-weight: 700;
  margin: 0;
  color: #111;
  letter-spacing: -0.5px;
}

.admin-nav {
  display: flex;
  gap: 30px;
}

.nav-link {
  font-family: 'Inter', sans-serif;
  font-size: 1rem;
  font-weight: 500;
  color: #999;
  text-decoration: none;
  padding-bottom: 5px;
  transition: all 0.3s ease;
}

.nav-link:hover {
  color: #111;
}

.nav-link.active {
  color: #111;
  border-bottom: 2px solid #111;
}

.divider-line {
  height: 1px;
  background-color: #e0e0e0;
}

/* Content Header */
.content-header {
  margin-bottom: 30px;
}

.section-title {
  font-family: 'Playfair Display', serif;
  font-size: 1.8rem;
  font-weight: 600;
  color: #333;
  margin: 0 0 8px 0;
}

.section-desc {
  font-family: 'Inter', sans-serif;
  font-size: 0.95rem;
  color: #666;
  margin: 0;
}

/* Language Tabs */
.lang-tabs {
  display: flex;
  gap: 0;
  margin-bottom: 24px;
  border-bottom: 1px solid #e5e7eb;
}

.tab-btn {
  font-family: 'Inter', sans-serif;
  font-size: 0.95rem;
  font-weight: 500;
  padding: 12px 24px;
  background: transparent;
  border: none;
  border-bottom: 2px solid transparent;
  color: #666;
  cursor: pointer;
  transition: all 0.2s ease;
}

.tab-btn:hover {
  color: #111;
}

.tab-btn.active {
  color: #111;
  border-bottom-color: #111;
}

.profile-form {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* Avatar Section */
.avatar-section {
  display: flex;
  align-items: center;
  gap: 24px;
}

.avatar-preview {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  overflow: hidden;
  background: #f3f4f6;
  flex-shrink: 0;
}

.avatar-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  font-size: 2.5rem;
  font-weight: 600;
  font-family: 'Inter', sans-serif;
}

.avatar-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: flex-start;
}

.avatar-actions .btn {
  min-width: 120px;
}

.avatar-hint {
  font-size: 0.8rem;
  color: #666;
  margin: 0;
}

.hidden-input {
  display: none;
}

.btn.danger {
  color: #dc2626;
  border-color: #fecaca;
}

.btn.danger:hover {
  background: #fef2f2;
  border-color: #dc2626;
  color: #dc2626;
}

.card {
  padding: 24px;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  background: #fff;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.card-header h2 {
  font-family: 'Playfair Display', serif;
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.field.full-width {
  grid-column: 1 / -1;
}

.field label {
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  color: #333;
  font-size: 0.9rem;
}

.field input,
.field textarea,
.field select {
  padding: 10px 14px;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  font-size: 1rem;
  font-family: inherit;
}

.field input:focus,
.field textarea:focus {
  outline: none;
  border-color: #111;
}

.field textarea {
  resize: vertical;
}

/* Tags/Skills */
.tags-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.tag-item {
  display: flex;
  align-items: center;
  gap: 6px;
}

.tag-item input {
  padding: 6px 10px;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  width: 180px;
}

/* Values */
.values-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.value-item {
  display: grid;
  grid-template-columns: 1fr 2fr auto;
  gap: 12px;
  padding: 16px;
  background: #f9fafb;
  border-radius: 4px;
  align-items: start;
}

/* External Links */
.links-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.link-item {
  display: grid;
  grid-template-columns: 1fr 2fr auto;
  gap: 12px;
  padding: 16px;
  background: #f9fafb;
  border-radius: 4px;
  align-items: start;
}

.btn-remove {
  background: transparent;
  border: 1px solid #f87171;
  color: #dc2626;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 1.2rem;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-remove:hover {
  background: #fef2f2;
}

/* Buttons */
.btn {
  font-family: 'Inter', sans-serif;
  border: 1px solid #111;
  background: #111;
  color: #fff;
  padding: 10px 16px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  position: relative;
  overflow: hidden;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none !important;
}

.btn-primary {
  background: #111;
  color: #fff;
  padding: 12px 24px;
  font-size: 0.9rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.05);
}

.btn-primary:hover:not(:disabled) {
  background: #fff;
  color: #111;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
}

.btn.ghost {
  background: transparent;
  color: #111;
  border-color: #e5e7eb;
}

.btn.ghost:hover {
  border-color: #111;
  background: #111;
  color: #fff;
  transform: translateY(-1px);
}

.btn.small {
  padding: 6px 12px;
  font-size: 0.85rem;
}

.form-actions {
  display: flex;
  align-items: center;
  gap: 16px;
  padding-top: 16px;
}

.success {
  color: #15803d;
  margin: 0;
  font-weight: 500;
}

.error-box {
  padding: 16px;
  background: #fef2f2;
  color: #b91c1c;
  border-radius: 4px;
}

.placeholder {
  padding: 24px;
  color: #999;
  text-align: center;
}

.muted {
  color: #999;
  font-style: italic;
}

@media (max-width: 768px) {
  .header-top {
    flex-direction: column;
    gap: 20px;
  }

  .admin-nav {
    justify-content: center;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .value-item,
  .link-item {
    grid-template-columns: 1fr;
  }

  .btn-remove {
    justify-self: end;
  }
}

.cert-item {
  grid-template-columns: 1.5fr 1fr 0.8fr 1fr auto !important;
}

@media (max-width: 1024px) {
  .cert-item {
    grid-template-columns: 1fr 1fr auto !important;
  }
  .cert-item .field:nth-child(3),
  .cert-item .field:nth-child(4) {
    grid-column: span 1;
  }
}

/* Awards */
.awards-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.award-item {
  display: flex;
  gap: 12px;
  padding: 20px;
  background: #f9fafb;
  border-radius: 4px;
  align-items: start;
}

.award-fields {
  flex: 1;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

@media (max-width: 768px) {
  .award-fields {
    grid-template-columns: 1fr;
  }
}
</style>
