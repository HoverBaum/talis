import { Navbar } from '../Navbar'

export default function Tipps() {
  return (
    <div>
      <Navbar title="Tipps" />
      <article className="prose p-4 mx-auto">
        <h1>Tipps</h1>
        <p>Talis is optimized for use on mobile.</p>
        <p>
          On mobile it will work best if used in "fullscreen" or as an installed
          application, as it is designed to use your entire screen. Use the pop
          up or install it from your browsers menu. Please note that this will
          not make the application available offline!
        </p>

        <section>
          <h2>Sluggish rolling</h2>
          <p>
            If rolling becomes sluggish, try clearing the list of results to
            speed the app up again. Should not happen for the first 1000 rolls
            or so.
          </p>
        </section>
      </article>
    </div>
  )
}
