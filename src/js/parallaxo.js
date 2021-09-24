let windowInnerHeight = window.innerHeight
let parallaxes = []

const scrollHandler = (() => {
  const ret = { active: false }
  let timeout

  ret.activate = function activate() {
    if (ret.active) clearTimeout(timeout)
    else {
      ret.active = true
      requestAnimationFrame(runParallaxLoop)
    }
    timeout = setTimeout(() => ret.active = false, 20)
  }

  return ret
})()

const initializeParallax = () => {
  parallaxes = Array.prototype.map.call(document.getElementsByClassName('parallax'), element => {
    const { dataset }   = element
    const movement      = parseFloat(dataset.movement)
    const horizontal    = dataset.direction === 'horizontal'
    const reverse       = dataset.reverse   === 'true'
    const multiplier    = horizontal ? [1, 0] : [0, 1]
    const boundingRect  = element.getBoundingClientRect()
    const { width, height }    = boundingRect
    const inner         = element.children[0]

    if (horizontal) {
      inner.style.width  = `${width + movement}px`
    } else {
      inner.style.height = `${height + movement}px`
    }
    
    const parallaxObject = { element, movement, horizontal, reverse, multiplier, boundingRect, inner }
    
    // Run parallax to move it to init position
    runParallax( parallaxObject )
    
    return parallaxObject
  })
}

const runParallax = (parallax) => {
  const { element, inner, horizontal, reverse, movement, multiplier, boundingRect } = parallax
    
    const { top, height }     = element.getBoundingClientRect()
    const scrolledInContainer = windowInnerHeight - top
    const scrollArea          = windowInnerHeight + height
    const progress            = scrolledInContainer / scrollArea

    if (progress >= -0.05 && progress <= 1.05) {
      const position = reverse
                     ? movement * progress
                     : movement * (1 - progress)

      inner.style.transform = `translate3d(-${multiplier[0] * position}px, -${multiplier[1] * position}px, 0)`
    }
}

const runParallaxLoop = () => {
  Array.prototype.forEach.call(parallaxes, parallax => {
    runParallax(parallax)
  })
  if (scrollHandler.active) requestAnimationFrame(runParallaxLoop)
}

initializeParallax()

window.addEventListener('scroll', scrollHandler.activate, { passive: true })

// Re-Initialize the parallaxes if the window-size 
// changed as the heights/widths of the parallax containers may changed.
window.addEventListener('resize', initializeParallax, { passive: true })