import { Metadata } from 'next'
import { SetPageTitle } from '@/components/PageTitleProvider'
import { PWAInstallPrompt } from '@/components/PWAInstallPrompt'

export const metadata: Metadata = {
  title: 'About - Talis',
}

function AboutContent({ locale }: { locale: string }) {
  if (locale === 'de') {
    return (
      <>
        <SetPageTitle title="Über" />
        
        <h1>Über</h1>

        <p>
          Talis ist eine Würfel-App, die entwickelt wurde, um mehrere Spiele oder Konfigurationen von Würfeln zu unterstützen. 
          Sie unterstützt derzeit Shadowrun, D6-Würfel und Daggerheart.
        </p>

        <p>
          Es ist ein Hobby-Projekt von mir. Du kannst es als Open Source auf{' '}
          <a href="https://github.com/HoverBaum/talis">GitHub</a> finden. Ich habe dies als Nebenprojekt zum Entspannen 
          gestartet, mal sehen, wohin es führt.
        </p>

        <p>
          Fühl dich frei, <a href="https://hoverbaum.net/me#contact">Kontakt aufzunehmen</a> 😁
        </p>

        <h2>Mobile Nutzung & Offline-Unterstützung</h2>

        <p>
          Talis ist für die Nutzung auf Mobilgeräten optimiert und funktioniert vollständig offline als Progressive Web App (PWA).
        </p>

        <p>
          Auf Mobilgeräten funktioniert es am besten, wenn es im &quot;Vollbild&quot;-Modus oder als installierte Anwendung verwendet wird, 
          da es darauf ausgelegt ist, den gesamten Bildschirm zu nutzen. Du kannst es über das Menü deines Browsers installieren 
          oder die Installationsschaltfläche unten verwenden. Nach der Installation funktioniert Talis vollständig offline - 
          alle Würfel-Apps und Funktionen sind ohne Internetverbindung verfügbar.
        </p>

        <PWAInstallPrompt showInstalledHint={true} />

        <h2>Farbschema</h2>

        <p>
          Du kannst dein Lieblingsthema aus dem Dropdown-Menü in der Seitenleiste auswählen. Die Themes umfassen System, Hell, 
          Dunkel und benutzerdefinierte Themes wie Shadowrun, Cyberpunk und Synthwave.
        </p>

        <h2>Sprache</h2>

        <p>Du kannst die Sprache der App in der Seitenleiste ändern. Unterstützte Sprachen:</p>

        <ul>
          <li>English</li>
          <li>Deutsch</li>
        </ul>

        <h2>Langsames Würfeln</h2>

        <p>
          Wenn das Würfeln langsam wird, versuche die Liste der Ergebnisse zu löschen, um die App wieder zu beschleunigen. 
          Dies sollte für die ersten 1000 Würfe oder so nicht passieren.
        </p>
      </>
    )
  }

  // Default to English
  return (
    <>
      <SetPageTitle title="About" />
      
      <h1>About</h1>

      <p>
        Talis is a dice rolling app developed to support multiple games or configurations of dice. 
        It currently supports Shadowrun, D6 dice, and Daggerheart.
      </p>

      <p>
        It&apos;s a hobby project of mine. You can find it OpenSource on{' '}
        <a href="https://github.com/HoverBaum/talis">GitHub</a>. I started this as a side project to relax, 
        let&apos;s see where it will go.
      </p>

      <p>
        Feel free to <a href="https://hoverbaum.net/me#contact">reach out</a> 😁
      </p>

      <h2>Mobile use & Offline Support</h2>

      <p>
        Talis is optimized for use on mobile and works fully offline as a Progressive Web App (PWA).
      </p>

      <p>
        On mobile it will work best if used in &quot;fullscreen&quot; or as an installed application, 
        as it is designed to use your entire screen. You can install it from your browser&apos;s menu 
        or use the install button below. Once installed, Talis works completely offline - all dice rollers 
        and features are available without an internet connection.
      </p>

      <PWAInstallPrompt showInstalledHint={true} />

      <h2>Color Theme</h2>

      <p>
        You can select your favorite theme from the drop down in the sidebar menu. Themes include system, 
        light, dark, and custom themes like Shadowrun, Cyberpunk, and Synthwave.
      </p>

      <h2>Language</h2>

      <p>You can change the apps language from the sidebar. Supported languages:</p>

      <ul>
        <li>English</li>
        <li>Deutsch</li>
      </ul>

      <h2>Sluggish rolling</h2>

      <p>
        If rolling becomes sluggish, try clearing the list of results to speed the app up again. 
        Should not happen for the first 1000 rolls or so.
      </p>
    </>
  )
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  
  return <AboutContent locale={locale} />
}
