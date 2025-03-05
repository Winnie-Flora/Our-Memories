document.addEventListener("DOMContentLoaded", () => {
    // Elements
    const imageUpload = document.getElementById("image-upload")
    const musicUpload = document.getElementById("music-upload")
    const audioPlayer = document.getElementById("audio-player")
    const imageDisplay = document.getElementById("image-display")
    const thumbnailsContainer = document.getElementById("thumbnails")
    const prevBtn = document.getElementById("prev-btn")
    const nextBtn = document.getElementById("next-btn")
    const slideshowBtn = document.getElementById("slideshow-btn")
  
    // State
    const images = []
    let currentIndex = 0
    let slideshowInterval = null
  
    // Disable navigation buttons initially
    prevBtn.disabled = true
    nextBtn.disabled = true
    slideshowBtn.disabled = true
  
    // Handle image upload
    imageUpload.addEventListener("change", (e) => {
      const files = e.target.files
  
      if (files.length === 0) return
  
      // Clear existing content if this is the first upload
      if (images.length === 0) {
        imageDisplay.innerHTML = ""
      }
  
      // Process each file
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
  
        if (!file.type.match("image.*")) continue
  
        const reader = new FileReader()
  
        reader.onload = (e) => {
          // Add to images array
          images.push(e.target.result)
  
          // Create thumbnail
          createThumbnail(e.target.result, images.length - 1)
  
          // If this is the first image, display it
          if (images.length === 1) {
            displayImage(0)
  
            // Enable navigation buttons
            nextBtn.disabled = false
            prevBtn.disabled = true
            slideshowBtn.disabled = false
          } else if (images.length > 1) {
            // Enable all navigation buttons
            nextBtn.disabled = false
            prevBtn.disabled = currentIndex === 0
            slideshowBtn.disabled = false
          }
        }
  
        reader.readAsDataURL(file)
      }
    })
  
    // Handle music upload
    musicUpload.addEventListener("change", (e) => {
      const file = e.target.files[0]
  
      if (!file || !file.type.match("audio.*")) return
  
      const reader = new FileReader()
  
      reader.onload = (e) => {
        audioPlayer.src = e.target.result
        audioPlayer.load()
      }
  
      reader.readAsDataURL(file)
    })
  
    // Navigation buttons
    prevBtn.addEventListener("click", () => {
      if (currentIndex > 0) {
        displayImage(currentIndex - 1)
      }
    })
  
    nextBtn.addEventListener("click", () => {
      if (currentIndex < images.length - 1) {
        displayImage(currentIndex + 1)
      }
    })
  
    // Slideshow functionality
    slideshowBtn.addEventListener("click", () => {
      if (slideshowInterval) {
        // Stop slideshow
        clearInterval(slideshowInterval)
        slideshowInterval = null
        slideshowBtn.textContent = "Start Slideshow"
      } else {
        // Start slideshow
        slideshowBtn.textContent = "Stop Slideshow"
        slideshowInterval = setInterval(() => {
          if (currentIndex < images.length - 1) {
            displayImage(currentIndex + 1)
          } else {
            displayImage(0) // Loop back to the first image
          }
        }, 3000) // Change image every 3 seconds
      }
    })
  
    // Create thumbnail function
    function createThumbnail(src, index) {
      const thumbnail = document.createElement("img")
      thumbnail.src = src
      thumbnail.classList.add("thumbnail")
      thumbnail.dataset.index = index
  
      thumbnail.addEventListener("click", function () {
        displayImage(Number.parseInt(this.dataset.index))
      })
  
      thumbnailsContainer.appendChild(thumbnail)
    }
  
    // Display image function
    function displayImage(index) {
      if (index < 0 || index >= images.length) return
  
      // Update current index
      currentIndex = index
  
      // Update image display
      imageDisplay.innerHTML = ""
      const img = document.createElement("img")
      img.src = images[index]
      imageDisplay.appendChild(img)
  
      // Update thumbnails
      const thumbnails = document.querySelectorAll(".thumbnail")
      thumbnails.forEach((thumb, i) => {
        if (i === index) {
          thumb.classList.add("active")
        } else {
          thumb.classList.remove("active")
        }
      })
  
      // Update navigation buttons
      prevBtn.disabled = index === 0
      nextBtn.disabled = index === images.length - 1
    }
  })
  
  