import './App.css'
import HeroSection from './components/HeroSection'
import BlurSection from './components/BlurSection'
import WaterRippleSection from './components/WaterRippleSection'
import ThreeJSModel from './components/ThreeJSModel'

function App() {
  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <ThreeJSModel />
      <div className="spacer-top" style={{ height: '100vh' }}></div>
      
      {/* <HeroSection />
      <BlurSection />
      <WaterRippleSection /> */}

      <div className="spacer-bottom" style={{ height: '100vh' }}></div>
    </div>
  )
}

export default App