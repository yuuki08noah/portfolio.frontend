// Portfolio Data — Sample content for the portfolio site

import type { Certification } from '~/types/portfolio'

// New Project types for the Projects page
export type PortfolioProject = {
    id: string
    slug: string
    title: string
    description: string
    coverImage?: string
    stack: string[]
    links: {
        demo?: string
        repo?: string
    }
    blogFolder?: string
    createdAt: string
}

export type ProjectDocument = {
    id: string
    projectId: string
    category: 'overview' | 'troubleshooting' | 'technical' | 'devlog' | 'references'
    title: string
    slug: string
    content: string
    order: number
    velogUrl?: string
    velogStats?: {
        likes: number
        comments: number
        views: number
        lastSyncedAt: string
    }
}

// Legacy type for destinations (keeping for backward compatibility)
export type PortfolioItem = {
    id: string
    title: string
    description: string
    itinerary: string[] // Features
    souvenirs: string[] // Screenshots/images
    stack: string[] // Tech stack
    links: {
        demo?: string
        repo?: string
    }
}

export type Milestone = {
    id: string
    type: 'education' | 'experience'
    title: string
    organization: string
    period: string
    location?: string
    details: string[]
}

export type ProfileData = {
    name: string
    tagline: string
    bio: string
    skills: string[]
    values: Array<{
        title: string
        description: string
    }>
}

export type ExternalLink = {
    name: string
    url: string
    icon: string
}

export type Award = {
    id: string
    title: string
    organization: string
    date: string
    description?: string
    badge?: string
}

// Sample Portfolio Projects
export const portfolioItems: PortfolioItem[] = [
    {
        id: '1',
        title: 'E-Commerce Platform',
        description: 'A modern e-commerce platform with real-time inventory management and seamless checkout experience.',
        itinerary: [
            'Real-time inventory tracking',
            'Secure payment integration',
            'Admin dashboard',
            'Mobile-responsive design'
        ],
        souvenirs: [
            'https://source.unsplash.com/800x600/?ecommerce,shopping',
            'https://source.unsplash.com/800x600/?dashboard,analytics'
        ],
        stack: ['Vue.js', 'Node.js', 'PostgreSQL', 'Stripe'],
        links: {
            demo: 'https://demo.example.com',
            repo: 'https://github.com/example/ecommerce'
        }
    },
    {
        id: '2',
        title: 'Travel Blog Platform',
        description: 'A beautiful travel blog platform with interactive maps and photo galleries.',
        itinerary: [
            'Interactive travel maps',
            'Photo galleries with filters',
            'SEO optimization',
            'Social sharing'
        ],
        souvenirs: [
            'https://source.unsplash.com/800x600/?travel,blog',
            'https://source.unsplash.com/800x600/?map,journey'
        ],
        stack: ['Nuxt.js', 'TypeScript', 'Tailwind CSS', 'Cloudinary'],
        links: {
            demo: 'https://travel.example.com',
            repo: 'https://github.com/example/travel-blog'
        }
    },
    {
        id: '3',
        title: 'Task Management App',
        description: 'A collaborative task management application with real-time updates and team features.',
        itinerary: [
            'Real-time collaboration',
            'Kanban board view',
            'Team management',
            'Email notifications'
        ],
        souvenirs: [
            'https://source.unsplash.com/800x600/?task,productivity',
            'https://source.unsplash.com/800x600/?team,collaboration'
        ],
        stack: ['React', 'Firebase', 'Material-UI', 'WebSocket'],
        links: {
            repo: 'https://github.com/example/task-manager'
        }
    }
]

// Sample Milestones (Resume)
export const milestones: Milestone[] = [
    {
        id: '1',
        type: 'education',
        title: 'Bachelor of Science in Computer Science',
        organization: 'University of Technology',
        period: '2016 - 2020',
        location: 'Seoul, Korea',
        details: [
            'Major in Computer Science',
            'GPA: 3.8/4.0',
            'Graduated with Honors',
            'Focus on Web Development and Algorithms'
        ]
    },
    {
        id: '2',
        type: 'experience',
        title: 'Senior Frontend Developer',
        organization: 'Tech Innovations Inc.',
        period: '2022 - Present',
        location: 'Remote',
        details: [
            'Led development of customer-facing web applications',
            'Mentored junior developers and conducted code reviews',
            'Implemented modern frontend architecture with Vue.js and Nuxt',
            'Improved site performance by 40% through optimization'
        ]
    },
    {
        id: '3',
        type: 'experience',
        title: 'Full Stack Developer',
        organization: 'Digital Solutions Co.',
        period: '2020 - 2022',
        location: 'Seoul, Korea',
        details: [
            'Developed and maintained multiple client projects',
            'Built RESTful APIs with Node.js and Express',
            'Implemented responsive UI components with Vue.js',
            'Collaborated with design team on UX improvements'
        ]
    }
]

// Profile Information
export const profileData: ProfileData = {
    name: 'Sejun Bang',
    tagline: 'DevOps Engineer | Cloud Infrastructure Specialist',
    bio: 'Hello, I am Sejun Bang, a developer who never stops learning. My goal is to become a DevOps engineer who efficiently manages complex software systems. As modern software becomes increasingly complex, the importance of software architecture continues to grow. I aspire to design and operate sophisticated software systems as a DevOps engineer.',
    skills: [
        'Kubernetes',
        'Docker / docker-compose',
        'Istio / Helm',
        'Prometheus / Grafana',
        'AWS / GCP',
        'Go / Python / Java / Javascript',
        'Spring Boot / FastAPI / Next.js / React',
        'MySQL / Redis',
        'Network / Linux / Raspberry Pi',
        'Github'
    ],
    values: [
        {
            title: 'Proof of Diligence',
            description: 'A developer who grows through consistent learning and practice. Proven dedication through academic excellence awards and various competition achievements.'
        },
        {
            title: 'Design-First Approach',
            description: 'Beyond simple feature implementation, I prioritize architecture design that considers scalability, availability, and security.'
        },
        {
            title: 'System Optimization',
            description: 'Efficiently managing and optimizing complex systems to deliver stable and reliable services.'
        },
        {
            title: 'Continuous Learning',
            description: 'Actively learning new technologies and trends, sharing knowledge through community activities and conference participation.'
        }
    ]
}

// External Links (Compass)
export const externalLinks: ExternalLink[] = [
    {
        name: 'GitHub',
        url: 'https://github.com/yuuki08noah',
        icon: ''
    },
    {
        name: 'Email',
        url: 'mailto:noah8.technologies@proton.me',
        icon: ''
    },
    {
        name: 'Phone',
        url: 'tel:010-6366-5783',
        icon: ''
    }
]

// Certifications
export const certifications: Certification[] = [
    {
        id: '1',
        name: 'TOPCIT 555',
        host: '과학기술정보통신부',
        date: '2024-11-18',
        kind: 'Certifications'
    },
    {
        id: '2',
        name: 'JLPT N2',
        date: '2024-08-13',
        kind: 'Certifications'
    },
    {
        id: '3',
        name: 'TOEIC 820',
        date: '2024-08-13',
        kind: 'Certifications'
    },
    {
        id: '4',
        name: 'Industrial Engineer Information Processing',
        host: '한국산업인력공단',
        date: '2025-07-16',
        kind: 'Certifications'
    },
    {
        id: '5',
        name: 'PCCP Level 1',
        date: '2025-03-16',
        kind: 'Certifications'
    },
    {
        id: '6',
        name: 'Busan Information Gifted Education Center - Robot Creation Class 1',
        date: '2021-03-02 ~ 2023-12-30',
        kind: 'Certifications'
    },
    {
        id: '7',
        name: 'Hanseong Nobel Young Scholarship',
        date: '2025-02-12',
        kind: 'Member'
    },
    {
        id: '8',
        name: 'Hanseong Son Jae-han Scholarship Foundation Young Scholarship',
        kind: 'Member'
    },
    {
        id: '9',
        name: 'Busan Information Gifted Education Center - Robot Creation Class 1',
        kind: 'Member'
    }
]

// Sample Awards
export const awards: Award[] = [
    {
        id: '1',
        title: '2025 Major Club Competition Gold Prize (1st Place)',
        organization: 'Busan Software Meister High School',
        date: '2025-11',
        badge: ''
    },
    {
        id: '2',
        title: '10th National High School Club Software Competition Bronze Prize',
        organization: 'KAIST & 4 Universities',
        date: '2025-11',
        description: 'KAIST and 4 University Presidents Award',
        badge: ''
    },
    {
        id: '3',
        title: 'Silicon Valley AI Seminar & Project Pitching Workshop MOONSHOT AWARD',
        organization: 'San Jose State University',
        date: '2025-06',
        description: '1st Place',
        badge: ''
    },
    {
        id: '4',
        title: 'Counterspell Game Jam - Sustainable Goals Category',
        organization: 'Tongmyong University ICT Convergence College',
        date: '2024-12',
        description: 'Excellence Award',
        badge: ''
    },
    {
        id: '5',
        title: 'School Algorithm Competition',
        organization: 'Busan Software Meister High School',
        date: '2024 & 2025',
        description: 'Excellence Award (1st Place)',
        badge: ''
    }
]

// Sample Projects (New Projects page)
export const sampleProjects: PortfolioProject[] = [
    {
        id: '1',
        slug: 'portfolio-website',
        title: 'Travel-Themed Portfolio',
        description: 'A New York Times-inspired portfolio with journey theme featuring dynamic city themes, responsive design, and integrated blog documentation.',
        coverImage: 'https://source.unsplash.com/800x600/?portfolio,website',
        stack: ['Nuxt 4', 'Vue 3', 'TypeScript', 'Ruby on Rails', 'PostgreSQL'],
        links: {
            repo: 'https://github.com/yourusername/portfolio'
        },
        blogFolder: '/blog/projects/portfolio-website',
        createdAt: '2025-01-15'
    },
    {
        id: '2',
        slug: 'ai-chat-platform',
        title: 'AI Chat Platform',
        description: 'Real-time chat application with AI-powered responses, multi-language support, and advanced conversation management.',
        coverImage: 'https://source.unsplash.com/800x600/?ai,chat',
        stack: ['Next.js', 'React', 'OpenAI API', 'WebSocket', 'Redis', 'MongoDB'],
        links: {
            demo: 'https://chat-demo.example.com',
            repo: 'https://github.com/yourusername/ai-chat'
        },
        blogFolder: '/blog/projects/ai-chat-platform',
        createdAt: '2024-11-20'
    },
    {
        id: '3',
        slug: 'ecommerce-platform',
        title: 'Modern E-Commerce Platform',
        description: 'Full-featured e-commerce platform with real-time inventory, secure payments, and comprehensive admin dashboard.',
        coverImage: 'https://source.unsplash.com/800x600/?ecommerce,shop',
        stack: ['Vue 3', 'Node.js', 'Express', 'PostgreSQL', 'Stripe', 'Redis'],
        links: {
            demo: 'https://shop-demo.example.com',
            repo: 'https://github.com/yourusername/ecommerce'
        },
        blogFolder: '/blog/projects/ecommerce-platform',
        createdAt: '2024-09-10'
    }
]

// Sample Project Documents
export const sampleProjectDocs: ProjectDocument[] = [
    // Portfolio Website Docs
    {
        id: 'doc-1',
        projectId: '1',
        category: 'overview',
        title: 'Project Overview',
        slug: 'overview',
        content: '# Travel-Themed Portfolio\n\nThis portfolio website was built to showcase my journey as a developer...',
        order: 1,
        velogUrl: 'https://velog.io/@username/portfolio-overview',
        velogStats: {
            likes: 42,
            comments: 8,
            views: 523,
            lastSyncedAt: '2025-01-20T10:00:00Z'
        }
    },
    {
        id: 'doc-2',
        projectId: '1',
        category: 'troubleshooting',
        title: 'Nuxt 4 SSR Issues',
        slug: 'nuxt-ssr-issues',
        content: '# Troubleshooting Nuxt 4 SSR\n\nWhen implementing SSR with Nuxt 4, I encountered several challenges...',
        order: 1,
        velogUrl: 'https://velog.io/@username/nuxt-ssr-troubleshooting',
        velogStats: {
            likes: 156,
            comments: 23,
            views: 1842,
            lastSyncedAt: '2025-01-20T10:00:00Z'
        }
    },
    {
        id: 'doc-3',
        projectId: '1',
        category: 'technical',
        title: 'Theme System Architecture',
        slug: 'theme-system',
        content: '# Dynamic Theme System\n\nThe theme system allows users to switch between different city themes...',
        order: 1,
        velogUrl: 'https://velog.io/@username/theme-system-architecture',
        velogStats: {
            likes: 89,
            comments: 12,
            views: 734,
            lastSyncedAt: '2025-01-20T10:00:00Z'
        }
    },
    {
        id: 'doc-4',
        projectId: '1',
        category: 'devlog',
        title: 'Week 1: Project Setup',
        slug: 'week-01-setup',
        content: '# Development Log - Week 1\n\nStarted the project by setting up Nuxt 4 with TypeScript...',
        order: 1
    }
]
