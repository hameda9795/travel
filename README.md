# Canarische Eilanden Travel Portal

Een high-end reisspecialist portal voor de Canarische Eilanden, gebouwd met Next.js 14, TypeScript en Tailwind CSS. Het project is geoptimaliseerd voor SEO met EEAT (Expertise, Authoritativeness, Trustworthiness) principes.

## Features

### SEO & EEAT Optimalisatie
- **Feature Snippets**: Overzichtelijke informatieblokken voor snelle feiten
- **FAQ Secties**: Met Schema.org structured data voor rijke zoekresultaten
- **Pros & Cons Lijsten**: Voor eerlijke en transparante hotelbeoordelingen
- **Schema.org Markup**: Voor hotels, FAQ's en reviews
- **Optimized Metadata**: Per pagina geoptimaliseerde meta tags

### URL Structuur
```
/ (Home)
/gran-canaria (Eiland overzicht)
/gran-canaria/hotels (Hotel categorie)
/gran-canaria/hotels/seaside-palm-beach (Specifiek hotel)
```

### UI/UX Componenten
- **Topic Clusters**: Voor gestructureerde content organisatie
- **Search & Filter Sidebar**: Voor accommodatie zoeken en filteren
- **Breadcrumb Navigation**: Voor duidelijke navigatie hiërarchie
- **Responsive Design**: Mobile-first aanpak
- **Professional Typography**: Optimaal voor long-form content

### Performance Optimizaties
- Next.js Image Optimization (AVIF, WebP)
- Lazy loading voor afbeeldingen
- Geoptimaliseerde bundle sizes
- React Compiler enabled

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **Fonts**: Geist Sans & Geist Mono

## Project Structuur

```
canary-islands-portal/
├── app/
│   ├── layout.tsx                    # Root layout met Header & Footer
│   ├── page.tsx                      # Homepage
│   ├── globals.css                   # Global styles & Tailwind config
│   └── gran-canaria/
│       ├── page.tsx                  # Gran Canaria overzicht
│       └── hotels/
│           ├── page.tsx              # Hotels lijst
│           └── seaside-palm-beach/
│               └── page.tsx          # Hotel detail pagina
├── components/
│   ├── layout/
│   │   ├── Header.tsx               # Hoofdnavigatie
│   │   ├── Footer.tsx               # Footer met links
│   │   └── Breadcrumb.tsx           # Breadcrumb navigatie
│   ├── seo/
│   │   ├── FeatureSnippet.tsx       # Feature snippet component
│   │   ├── FAQ.tsx                  # FAQ met Schema.org
│   │   └── ProsConsList.tsx         # Pros & Cons component
│   └── ui/
│       ├── IslandCard.tsx           # Eiland kaart
│       ├── HotelCard.tsx            # Hotel kaart
│       ├── TopicCluster.tsx         # Topic cluster component
│       └── SearchFilterSidebar.tsx  # Zoek & filter sidebar
└── public/
```

## Installatie

```bash
# Installeer dependencies
npm install

# Start development server
npm run dev
```

De applicatie is beschikbaar op [http://localhost:3000](http://localhost:3000)

## Development Scripts

```bash
npm run dev      # Start development server
npm run build    # Build voor productie
npm run start    # Start productie server
npm run lint     # Run ESLint
```

## SEO Best Practices

### Metadata
Elke pagina heeft geoptimaliseerde metadata:
- Title tags met keywords
- Meta descriptions (150-160 karakters)
- Open Graph tags voor social media
- Keywords voor relevantie

### Structured Data
Schema.org markup voor:
- Hotels (met ratings, locatie, faciliteiten)
- FAQ's (voor featured snippets)
- Breadcrumbs (voor navigatie)

### Content Structuur
- H1-H6 hiërarchie correct toegepast
- Semantische HTML
- Alt teksten voor afbeeldingen
- Internal linking strategy

## Styling Guidelines

### Kleurenpalet
- **Primary**: `#0f766e` (Teal) - Voor CTA's en accenten
- **Secondary**: `#f59e0b` (Amber) - Voor highlights
- **Accent**: `#06b6d4` (Cyan) - Voor interactieve elementen
- **Muted**: `#f8fafc` - Voor achtergronden

### Typography
- **Headings**: Geist Sans (bold)
- **Body**: Geist Sans (regular)
- **Code**: Geist Mono

### Spacing
- Section padding: 5rem (80px)
- Container padding: 1.5rem (24px)

## Browser Ondersteuning

- Chrome (laatste 2 versies)
- Firefox (laatste 2 versies)
- Safari (laatste 2 versies)
- Edge (laatste 2 versies)

## Toekomstige Uitbreidingen

- [ ] Blog sectie met reisartikelen
- [ ] Booking integratie
- [ ] Multi-language support
- [ ] User reviews systeem
- [ ] Interactive kaarten
- [ ] Weersvoorspelling API
- [ ] Newsletter signup

## Licentie

Dit project is ontwikkeld als demonstratie voor een Canarische Eilanden reisportal.
