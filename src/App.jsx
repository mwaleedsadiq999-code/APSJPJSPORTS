import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Squad from './components/Squad'
import ClubPhoto from './components/ClubPhoto'
import Leaders from './components/Leaders'
import Stats from './components/Stats'
import Support from './components/Support'
import Footer from './components/Footer'

export default function App() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Squad />
        <ClubPhoto />
        <Leaders />
        <Stats />
        <Support />
      </main>
      <Footer />
    </>
  )
}
