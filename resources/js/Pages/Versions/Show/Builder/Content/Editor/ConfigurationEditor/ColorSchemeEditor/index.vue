<template>

    <div class="grid grid-cols-3 gap-x-8 gap-y-4">

        <div v-for="(event_color, event_name) in useVersionBuilder.builder.color_scheme.event_colors" :key="event_name"
             class="col-span-1 flex items-center justify-between p-2 pl-4 rounded-md cursor-pointer transition-all duration-300"
             @mouseenter="addHover(event_name)" @mouseleave="removeHover(event_name)"
             :style="style(event_name, event_color)"
             @click="openColorPicker(event_name, $event)">

            <!-- Name -->
            <span class="text-xs mr-4">{{ event_name }}</span>

            <!-- Color Picker -->
            <DefaultColorPicker :ref="event_name" v-model="useVersionBuilder.builder.color_scheme.event_colors[event_name]"></DefaultColorPicker>

        </div>

    </div>

</template>

<script>

    import { useVersionBuilder } from '@stores/VersionBuilder';
    import DefaultColorPicker from '@components/ColorPicker/DefaultColorPicker';

    export default {
        components: { DefaultColorPicker },
        data(){
            return {
                namesHovered: [],
                useVersionBuilder: useVersionBuilder()
            }
        },
        methods: {
            addHover(name){
                this.namesHovered.push(name);
            },
            removeHover(name){
                this.namesHovered.splice(this.namesHovered.indexOf(name), 1);
            },
            isHovering(name){
                return this.namesHovered.includes(name);
            },
            style(name, color){
                return {
                    border: '1px solid ' + this.color(name, color, 50),
                    backgroundColor: this.color(name, color, 10),
                }
            },
            color(name, color, opacity){
                return this.isHovering(name) ? color+opacity : 'transparent';
            },
            openColorPicker(event_name, e){
                this.$refs[event_name][0].$refs.colorPicker.handleTrigger();
            }
        }
    };

</script>
