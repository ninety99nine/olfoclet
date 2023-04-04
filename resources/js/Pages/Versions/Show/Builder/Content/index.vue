<template>

    <div class="relative">

        <EditorContent v-show="(showEditor || editorHasStyles)" class="w-full bg-white" :style="editorStyle"></EditorContent>

        <SimulatorContent v-show="(!showEditor || simulatorHasStyles)" class="w-full bg-white" :style="simulatorStyle"></SimulatorContent>

    </div>

</template>

<script>

    import EditorContent from "./Editor";
    import SimulatorContent from "./Simulator";

    export default {
        props: ['showEditor'],
        components: { EditorContent, SimulatorContent },
        data(){
            return {
                editorStyle: {},
                setInterval: null,
                simulatorStyle: {},
            }
        },
        /**
         *  Since vue 3 does not support v-show on multiple elements nested
         *  within the <Transition> tag, i had to create custom logic to
         *  transition between the Editor and Simulator content. The
         *  <Transition> tag supports multiple elements when using
         *  the v-if/v-else-if/v-else, however this destroys the
         *  component which means that we cannont preserve the
         *  state each time we transition between the Editor
         *  and Simulator content. This customized solution
         *  solves that problem.
         */
        watch: {
            showEditor(newValue, oldValue) {

                if( this.setInterval !== null ) {
                    clearInterval(this.setInterval);
                }

                /**
                 *  If the newValue is True, then we want to start the opacity of the
                 *  editorStyle from 0 and steadily increase to 1 while the position
                 *  is set to absolute until it reaches an opacity of "1".
                 *
                 *  While this happens, we want to start the opacity of the simulatorStyle
                 *  from 1 and steadily decrease to 0 while the position is set to "unset"
                 *  until it reaches an opacity of "0".
                 *
                 *  If the newValue is False, Then the logic is reversed.
                 */

                this.editorStyle = {
                    position: 'absolute',
                    opacity: newValue ? 0 : 1,
                    zIndex: newValue ? '10' : '0',
                };

                this.simulatorStyle = {
                    position: 'absolute',
                    opacity: newValue ? 1 : 0,
                    zIndex: newValue ? '0' : '10',
                };

                this.setInterval = setInterval(() => {

                    const largeValue = 1/100;
                    const smallValue = 0.5/100;

                    /**
                     *  If we must show the editor, then slowly increase the editor
                     *  opacity while slowly reducing the simulator opacity.
                     */
                    if( newValue ) {

                        //  If we are at 80% opacity, slow down the increment and decrement
                        if( this.editorStyle.opacity >= 80/100 ) {

                            this.editorStyle.opacity += smallValue;
                            this.simulatorStyle.opacity -= smallValue;

                        }else{

                            this.editorStyle.opacity += largeValue;
                            this.simulatorStyle.opacity -= largeValue;
                        }

                    /**
                     *  If we must show the simulator, then slowly increase the simulator
                     *  opacity while slowly reducing the editor opacity.
                     */
                    }else{

                        //  If we are at 80% opacity, slow down the increment and decrement
                        if( this.simulatorStyle.opacity >= 80/100 ) {

                            this.simulatorStyle.opacity += smallValue;
                            this.editorStyle.opacity -= smallValue;

                        }else{

                            this.simulatorStyle.opacity += largeValue;
                            this.editorStyle.opacity -= largeValue;
                        }

                    }

                    //  If either of the opacity's reaches 1 or greater, then stop
                    if( (newValue == true && this.editorStyle.opacity >= 1 ) || (newValue == false && this.simulatorStyle.opacity >= 1 ) ) {

                        //  Stop this "setInterval" function
                        clearInterval(this.setInterval);

                        //  Reset the styles
                        this.editorStyle = {};
                        this.simulatorStyle = {};

                    }

                } , 5);

            }
        },
        computed: {
            editorHasStyles() {
                return Object.keys(this.editorStyle).length
            },
            simulatorHasStyles() {
                return Object.keys(this.simulatorStyle).length
            }
        },
        beforeUnmount() {
            clearInterval(this.setInterval);
        }
    };

</script>
