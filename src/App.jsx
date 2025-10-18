import './App.css'
import HeroSection from './components/HeroSection'
import BlurSection from './components/BlurSection'
import WaterRippleSection from './components/WaterRippleSection'
import ThreeJSModel from './components/ThreeJSModel'
import StackedAutoSlider from './components/StackedAutoSlider'
import BookFlip from './components/BookFlip'

function App() {
  return (
    <div style={{ width: '100%', minHeight: '300vh' }}>
    {/* <BookFlip />   */}
      <div style={{ height: '100vh', width: '100vw' }}>
        <StackedAutoSlider images={[
          'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=400&h=600&fit=crop',
          'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=400&h=600&fit=crop',
          'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=600&fit=crop',
          'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=400&h=600&fit=crop',
          'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=600&fit=crop',
          'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=600&fit=crop',
          'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=600&fit=crop',
          'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=600&fit=crop',
          'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=600&fit=crop',
          'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=600&fit=crop',
          'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=600&fit=crop',
          'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=600&fit=crop',
        ]} />
      </div>
      {/* <BlurSection /> */}
      {/* <HeroSection /> */}
    </div>
  )
}

export default App