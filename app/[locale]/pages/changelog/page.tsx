import { Metadata } from 'next'
import Link from 'next/link'
import { SetPageTitle } from '@/components/PageTitleProvider'

export const metadata: Metadata = {
  title: 'Changelog - Talis',
}

function ChangelogContent({ locale }: { locale: string }) {
  if (locale === 'de') {
    return (
      <>
        <SetPageTitle title="Änderungsprotokoll" />
        
        <h1>Änderungsprotokoll</h1>

        <h2>2025-11-21 Neue Benutzeroberfläche + Offline-Verfügbarkeit 🎨</h2>

        <p>
          Die Benutzeroberfläche verwendet nun ein neues Basisdesign. Du wirst bemerken, dass Schaltflächen 
          anders aussehen und Farbthemen anders angewendet werden - vorerst werden Themes nicht mehr auf 
          Würfelergebnisse angewendet. Für technisch Interessierte: Die App verwendet jetzt Shadcn/UI.
        </p>

        <p>
          Die App läuft jetzt auch vollständig offline. Du musst sie eine Weile geöffnet haben, während du 
          online bist, dann lädt die App alle erforderlichen Dateien im Hintergrund herunter. Egal wohin dich 
          deine Abenteuer führen, Talis wird bei dir sein!
        </p>

        <h2>2025-07-19 Daggerheart kommt zu Talis 🎲</h2>

        <p>
          Wir unterstützen jetzt das Dualitätswürfelsystem von Daggerheart. Dies ist vorerst eine Beta-Version, 
          während wir herausfinden, was Daggerheart-Spieler benötigen. Feedback ist willkommen 😊
        </p>

        <h2>2023-12-06 D6 Würfel-App stabil 🎉</h2>

        <p>Die D6 Würfel-App gilt nun als stabil. Schau dir die verfügbaren Einstellungen an:</p>

        <ul>
          <li>Zeige neue Ergebnisse unten oder oben an.</li>
          <li>Addiere alle geworfenen Würfel.</li>
          <li>Sortiere Würfel, wenn du möchtest.</li>
        </ul>

        <h2>2023-12-06 Tipps-Seite in Über zusammengeführt</h2>

        <p>
          Es gibt keine &quot;Tipps&quot;-Seite mehr. Stattdessen findest du deren Inhalte auf der{' '}
          <Link href="/de/pages/about">&quot;Über&quot;-Seite</Link>.
        </p>

        <h2>2023-12-06 Änderungsprotokoll eingeführt</h2>

        <p>
          Talis hat jetzt ein Änderungsprotokoll, in dem wir dich über Änderungen an der App auf dem Laufenden halten werden.
        </p>
      </>
    )
  }

  // Default to English
  return (
    <>
      <SetPageTitle title="Changelog" />
      
      <h1>Changelog</h1>

      <h2>2025-11-21 Changed UI + offline availability 🎨</h2>

      <p>
        The UI now uses a new base design. You will notice buttons looking differently and color themes 
        being applied differently - for now themes no longer apply to roll results. For technical folks: 
        the app now uses Shadcn/UI.
      </p>

      <p>
        The app now also runs fully offline. You need to have it open for a bit while online, the app will 
        download all required files in the background. No matter where your adventures takes you, Talis will 
        be there with you!
      </p>

      <h2>2025-07-19 Daggerheart is coming to Talis 🎲</h2>

      <p>
        We are now supporting the duality dice system of Daggerheart. This is a beta for now, as we figure 
        out what Daggerheart players need. Feedback welcome 😊
      </p>

      <h2>2023-12-06 D6 Roller Stable 🎉</h2>

      <p>The D6 roller is now considered stable. Check out the settings available:</p>

      <ul>
        <li>Show new results bottom or top.</li>
        <li>Sum all rolled dice.</li>
        <li>Sort dice, if you want.</li>
      </ul>

      <h2>2023-12-06 Merged Tipps page into About</h2>

      <p>
        There is no longer a &quot;Tipps&quot; page. Instead you can find it&apos;s contents on the{' '}
        <Link href="/en/pages/about">&quot;About&quot; page</Link>.
      </p>

      <h2>2023-12-06 Changelog introduced</h2>

      <p>
        Talis now has a Changelog where we will keep you informed about change to the app.
      </p>
    </>
  )
}

export default async function ChangelogPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  
  return <ChangelogContent locale={locale} />
}
