<template>
    <div class="device">
        <div class="screen">

            <!-- Screen Content -->
            <slot></slot>

        </div>
        <div class="speaker"></div>
        <div class="camera"></div>
        <div class="powerbutton"></div>
        <div class="volumebutton"></div>
        <div class="nav">
            <div class="back" id="back"></div>
            <div class="home"></div>
            <div class="overview"></div>
        </div>
    </div>
</template>

<script>
export default {

}
</script>

<style>

    .device {
        background: #000;
        padding: 63px 15px 80px;
        display: inline-block;
        position: relative;
        z-index:9;
        box-shadow: 0px 0px 1.74px 0.26px rgba(0, 0, 0, 0.004),inset 0px 0px 0px 3px rgba(0, 0, 0, 0.004);
        border-top-left-radius: 200px 30px;
            border-top-right-radius: 200px 30px;
            border-bottom-left-radius: 200px 30px;
            border-bottom-right-radius: 200px 30px;
        border:2px solid #525053;
    }

    .device > .screen {
        height: 640px;
        width: 360px;
        background-image: url("/images/nexus-5-screen-bg.png");
    }

    .device > .camera {
        background: rgb(56, 56, 56);
        position: absolute;
        left: 42px;
        top: 26px;
        height: 12px;
        width: 12px;
        border-radius: 50%;
        background-image: -moz-linear-gradient( 114deg, rgb(132,129,132) 0%, rgb(14,14,14) 100%);
        background-image: -webkit-linear-gradient( 114deg, rgb(132,129,132) 0%, rgb(14,14,14) 100%);
        background-image: -ms-linear-gradient( 114deg, rgb(132,129,132) 0%, rgb(14,14,14) 100%);
        box-shadow: 0.899px 0.438px 0px 0px rgba(0, 0, 0, 0.29),inset 1px 0px 0px 0px rgba(255, 255, 255, 0.26);
    }

    .device > .speaker {
        background: rgb(56, 56, 56);
        height: 16px;
        width: 16px;
        border-radius: 50%;
        position: absolute;
        left: 50%;
        top: 26px;
        background-image: -moz-linear-gradient( 114deg, rgb(132,129,132) 0%, rgb(14,14,14) 100%);
        background-image: -webkit-linear-gradient( 114deg, rgb(132,129,132) 0%, rgb(14,14,14) 100%);
        background-image: -ms-linear-gradient( 114deg, rgb(132,129,132) 0%, rgb(14,14,14) 100%);
        box-shadow: 0.899px 0.438px 0px 0px rgba(0, 0, 0, 0.29),inset 1px 0px 0px 0px rgba(255, 255, 255, 0.26);
    }

    .device > .camera:after {
        content:"";
        display:block;
        border-radius: 50%;
        background-color: rgb(125, 127, 144);
        position: absolute;
        left: 3px;
        top: 3px;
        width: 3px;
        height: 3px;
        z-index: 7;
    }


    .device > .nav {
        background: #000;
        height: 48px;
        width: 100%;
        display: flex;
        padding: 0 39px;
        box-sizing: border-box;
        opacity: 0.6;
    }

    .device > .nav > div {
        border: 2px solid white;
        height: 16px;
        width: 16px;
        margin: 16px 40px;

    }

    .device > .nav > .overview {
        border-radius: 3px;
    }

    .device > .nav > .home {
        border-radius: 50%;
    }

    .device > .nav >  .back {
        border: none;
        height: 17px;
        width: 2px;
        position: relative;
        background: #fff;

    }

    .device > .nav #back:before {
        content: "";
        position: absolute;
        display: block;
        height: 18px;
        width: 2px;
        transform: rotate(45deg);
        background: #fff;
        left: -7px;
        top: -5px;
        -webkit-transform: rotate(60deg);
    }

    .device > .nav #back:after {
        content: "";
        position: absolute;
        display: block;
        height: 18px;
        width: 2px;
        transform: rotate(-60deg);
        background: #fff;
        left: -7px;
        top: 3px;
        -webkit-transform: rotate(-60deg);
    }

    .device > .powerbutton {
        background:#000;
        box-shadow: 0px 0px 0.87px 0.13px rgba(0, 0, 0, 0.58),inset 0px 1px 0px 0px rgba(255, 255, 255, 0.14);
        position: absolute;
        left: 390px;
        top: 101px;
        width: 5px;
        height: 51px;
        z-index: 1;
    }

    .device > .volumebutton {
        background:#000;
        position: absolute;
        left: -6px;
        top: 152px;
        width: 6px;
        height: 110px;
        z-index: 10;
    }

</style>
