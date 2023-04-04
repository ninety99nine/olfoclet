<template>
    <div class="container">
        <div class="cube">
            <div class="sides">
            <div class="top"></div>
            <div class="right"></div>
            <div class="bottom"></div>
            <div class="left"></div>
            <div class="front"></div>
            <div class="back"></div>
            </div>
        </div>
    </div>
</template>

<script>

/**
 *  Reference 1: https://codemyui.com/hexagon-cube-loading-animation/ or
 *  Reference 2: https://codepen.io/CompuIves/pen/Ojjdoj
 */
export default {
    props: {
        show: {
            type: Boolean,
            default: true
        },
        withTransition: {
            type: Boolean,
            default: true
        }
    }
}
</script>

<style scoped>

.container {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  margin: 0 auto;
  width: 50%;
}

@-webkit-keyframes rotate {
  0% {
    transform: rotateX(-37.5deg) rotateY(45deg);
  }
  50% {
    transform: rotateX(-37.5deg) rotateY(405deg);
  }
  100% {
    transform: rotateX(-37.5deg) rotateY(405deg);
  }
}

@keyframes rotate {
  0% {
    transform: rotateX(-37.5deg) rotateY(45deg);
  }
  50% {
    transform: rotateX(-37.5deg) rotateY(405deg);
  }
  100% {
    transform: rotateX(-37.5deg) rotateY(405deg);
  }
}

.cube, .cube * {
  position: absolute;
  width: 101px;
  height: 101px;
}

.sides {
  -webkit-animation: rotate 3s ease infinite;
          animation: rotate 3s ease infinite;
  -webkit-animation-delay: 0.8s;
          animation-delay: 0.8s;
  transform-style: preserve-3d;
  transform: rotateX(-37.5deg) rotateY(45deg);
}

.cube .sides * {
  box-sizing: border-box;
  background-color: #1b64f150;
  border: 1px solid white;
}

.cube .sides .top {
  -webkit-animation: top-animation 3s ease infinite;
          animation: top-animation 3s ease infinite;
  -webkit-animation-delay: 0ms;
          animation-delay: 0ms;
  transform: rotateX(90deg) translateZ(100px);
  -webkit-animation-fill-mode: forwards;
          animation-fill-mode: forwards;
  transform-origin: 50% 50%;
}
@-webkit-keyframes top-animation {
  0% {
    opacity: 1;
    transform: rotateX(90deg) translateZ(100px);
  }
  20% {
    opacity: 1;
    transform: rotateX(90deg) translateZ(50px);
  }
  70% {
    opacity: 1;
    transform: rotateX(90deg) translateZ(50px);
  }
  90% {
    opacity: 1;
    transform: rotateX(90deg) translateZ(100px);
  }
  100% {
    opacity: 1;
    transform: rotateX(90deg) translateZ(100px);
  }
}
@keyframes top-animation {
  0% {
    opacity: 1;
    transform: rotateX(90deg) translateZ(100px);
  }
  20% {
    opacity: 1;
    transform: rotateX(90deg) translateZ(50px);
  }
  70% {
    opacity: 1;
    transform: rotateX(90deg) translateZ(50px);
  }
  90% {
    opacity: 1;
    transform: rotateX(90deg) translateZ(100px);
  }
  100% {
    opacity: 1;
    transform: rotateX(90deg) translateZ(100px);
  }
}
.cube .sides .bottom {
  -webkit-animation: bottom-animation 3s ease infinite;
          animation: bottom-animation 3s ease infinite;
  -webkit-animation-delay: 0ms;
          animation-delay: 0ms;
  transform: rotateX(-90deg) translateZ(100px);
  -webkit-animation-fill-mode: forwards;
          animation-fill-mode: forwards;
  transform-origin: 50% 50%;
}
@-webkit-keyframes bottom-animation {
  0% {
    opacity: 1;
    transform: rotateX(-90deg) translateZ(100px);
  }
  20% {
    opacity: 1;
    transform: rotateX(-90deg) translateZ(50px);
  }
  70% {
    opacity: 1;
    transform: rotateX(-90deg) translateZ(50px);
  }
  90% {
    opacity: 1;
    transform: rotateX(-90deg) translateZ(100px);
  }
  100% {
    opacity: 1;
    transform: rotateX(-90deg) translateZ(100px);
  }
}
@keyframes bottom-animation {
  0% {
    opacity: 1;
    transform: rotateX(-90deg) translateZ(100px);
  }
  20% {
    opacity: 1;
    transform: rotateX(-90deg) translateZ(50px);
  }
  70% {
    opacity: 1;
    transform: rotateX(-90deg) translateZ(50px);
  }
  90% {
    opacity: 1;
    transform: rotateX(-90deg) translateZ(100px);
  }
  100% {
    opacity: 1;
    transform: rotateX(-90deg) translateZ(100px);
  }
}
.cube .sides .front {
  -webkit-animation: front-animation 3s ease infinite;
          animation: front-animation 3s ease infinite;
  -webkit-animation-delay: 100ms;
          animation-delay: 100ms;
  transform: rotateY(0deg) translateZ(100px);
  -webkit-animation-fill-mode: forwards;
          animation-fill-mode: forwards;
  transform-origin: 50% 50%;
}
@-webkit-keyframes front-animation {
  0% {
    opacity: 1;
    transform: rotateY(0deg) translateZ(100px);
  }
  20% {
    opacity: 1;
    transform: rotateY(0deg) translateZ(50px);
  }
  70% {
    opacity: 1;
    transform: rotateY(0deg) translateZ(50px);
  }
  90% {
    opacity: 1;
    transform: rotateY(0deg) translateZ(100px);
  }
  100% {
    opacity: 1;
    transform: rotateY(0deg) translateZ(100px);
  }
}
@keyframes front-animation {
  0% {
    opacity: 1;
    transform: rotateY(0deg) translateZ(100px);
  }
  20% {
    opacity: 1;
    transform: rotateY(0deg) translateZ(50px);
  }
  70% {
    opacity: 1;
    transform: rotateY(0deg) translateZ(50px);
  }
  90% {
    opacity: 1;
    transform: rotateY(0deg) translateZ(100px);
  }
  100% {
    opacity: 1;
    transform: rotateY(0deg) translateZ(100px);
  }
}
.cube .sides .back {
  -webkit-animation: back-animation 3s ease infinite;
          animation: back-animation 3s ease infinite;
  -webkit-animation-delay: 100ms;
          animation-delay: 100ms;
  transform: rotateY(-180deg) translateZ(100px);
  -webkit-animation-fill-mode: forwards;
          animation-fill-mode: forwards;
  transform-origin: 50% 50%;
}
@-webkit-keyframes back-animation {
  0% {
    opacity: 1;
    transform: rotateY(-180deg) translateZ(100px);
  }
  20% {
    opacity: 1;
    transform: rotateY(-180deg) translateZ(50px);
  }
  70% {
    opacity: 1;
    transform: rotateY(-180deg) translateZ(50px);
  }
  90% {
    opacity: 1;
    transform: rotateY(-180deg) translateZ(100px);
  }
  100% {
    opacity: 1;
    transform: rotateY(-180deg) translateZ(100px);
  }
}
@keyframes back-animation {
  0% {
    opacity: 1;
    transform: rotateY(-180deg) translateZ(100px);
  }
  20% {
    opacity: 1;
    transform: rotateY(-180deg) translateZ(50px);
  }
  70% {
    opacity: 1;
    transform: rotateY(-180deg) translateZ(50px);
  }
  90% {
    opacity: 1;
    transform: rotateY(-180deg) translateZ(100px);
  }
  100% {
    opacity: 1;
    transform: rotateY(-180deg) translateZ(100px);
  }
}
.cube .sides .left {
  -webkit-animation: left-animation 3s ease infinite;
          animation: left-animation 3s ease infinite;
  -webkit-animation-delay: 100ms;
          animation-delay: 100ms;
  transform: rotateY(-90deg) translateZ(100px);
  -webkit-animation-fill-mode: forwards;
          animation-fill-mode: forwards;
  transform-origin: 50% 50%;
}
@-webkit-keyframes left-animation {
  0% {
    opacity: 1;
    transform: rotateY(-90deg) translateZ(100px);
  }
  20% {
    opacity: 1;
    transform: rotateY(-90deg) translateZ(50px);
  }
  70% {
    opacity: 1;
    transform: rotateY(-90deg) translateZ(50px);
  }
  90% {
    opacity: 1;
    transform: rotateY(-90deg) translateZ(100px);
  }
  100% {
    opacity: 1;
    transform: rotateY(-90deg) translateZ(100px);
  }
}
@keyframes left-animation {
  0% {
    opacity: 1;
    transform: rotateY(-90deg) translateZ(100px);
  }
  20% {
    opacity: 1;
    transform: rotateY(-90deg) translateZ(50px);
  }
  70% {
    opacity: 1;
    transform: rotateY(-90deg) translateZ(50px);
  }
  90% {
    opacity: 1;
    transform: rotateY(-90deg) translateZ(100px);
  }
  100% {
    opacity: 1;
    transform: rotateY(-90deg) translateZ(100px);
  }
}
.cube .sides .right {
  -webkit-animation: right-animation 3s ease infinite;
          animation: right-animation 3s ease infinite;
  -webkit-animation-delay: 100ms;
          animation-delay: 100ms;
  transform: rotateY(90deg) translateZ(100px);
  -webkit-animation-fill-mode: forwards;
          animation-fill-mode: forwards;
  transform-origin: 50% 50%;
}
@-webkit-keyframes right-animation {
  0% {
    opacity: 1;
    transform: rotateY(90deg) translateZ(100px);
  }
  20% {
    opacity: 1;
    transform: rotateY(90deg) translateZ(50px);
  }
  70% {
    opacity: 1;
    transform: rotateY(90deg) translateZ(50px);
  }
  90% {
    opacity: 1;
    transform: rotateY(90deg) translateZ(100px);
  }
  100% {
    opacity: 1;
    transform: rotateY(90deg) translateZ(100px);
  }
}
@keyframes right-animation {
  0% {
    opacity: 1;
    transform: rotateY(90deg) translateZ(100px);
  }
  20% {
    opacity: 1;
    transform: rotateY(90deg) translateZ(50px);
  }
  70% {
    opacity: 1;
    transform: rotateY(90deg) translateZ(50px);
  }
  90% {
    opacity: 1;
    transform: rotateY(90deg) translateZ(100px);
  }
  100% {
    opacity: 1;
    transform: rotateY(90deg) translateZ(100px);
  }
}

/*

.cube .sides .back {
    background-color: #f1831b80;
}

.cube .sides .front {
    background-color: #f11bdd80;
}

.cube .sides .right {
    background-color: #1bc1f180;
}

.cube .sides .bottom {
    background-color: #1b64f180;
}

*/

</style>
