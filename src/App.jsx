import './App.css'
import HeroSection from './components/HeroSection'
import BlurSection from './components/BlurSection'
import WaterRippleSection from './components/WaterRippleSection'
import ThreeJSModel from './components/ThreeJSModel'
import BookFlip from './components/BookFlip'

function App() {
  return (
    <div style={{ width: '100%', minHeight: '300vh' }}>
      <BookFlip />
    </div>
  )
}

export default App