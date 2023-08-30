import Link from 'next/link'
import { Navbar } from '../Navbar'

export default function Tipps() {
  return (
    <div>
      <Navbar title="Tipps" fixed={true} />
      <article className="prose lg:prose-lg p-4 mx-auto">
        <h1>Tipps</h1>
        <section>
          <h2>Mobile use</h2>
          <p>Talis is optimized for use on mobile.</p>
          <p>
            On mobile it will work best if used in "fullscreen" or as an
            installed application, as it is designed to use your entire screen.
            Use the pop up or install it from your browsers menu. Please note
            that this will not make the application available offline!
          </p>
        </section>

        <section>
          <h2>Color Theme</h2>
          <p>
            You can select your favorite theme from the drop down in the drawer
            menu on the left. On desktop you can also change the theme from the
            navbar.
          </p>
        </section>

        <section>
          <h2>Language</h2>
          <p>
            You can change the apps language from the sidebar. Supported
            languages:
          </p>
          <ul>
            <li>English</li>
            <li>Deutsch</li>
          </ul>
          <p>
            The information pages are currently only available in English
            though.
          </p>
        </section>

        <section>
          <h2>Sluggish rolling</h2>
          <p>
            If rolling becomes sluggish, try clearing the list of results to
            speed the app up again. Should not happen for the first 1000 rolls
            or so.
          </p>
        </section>

        <section>
          <h2>Feedback and Community</h2>
          <p>
            Join our Discord to give feedback, report bugs or just hang out with
            fellow Talis users.
          </p>
          <p>
            <Link href="https://discord.gg/KYdHnpDeyw" target="_blank">
              Join our Discord
            </Link>
          </p>
        </section>
      </article>
    </div>
  )
}
