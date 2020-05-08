<template>
    <span class="icon" v-bind:class="cls"></span>
</template>

<script>
    import {
        CHARACTER_TYPE_000,
        CHARACTER_TYPE_001,
        CHARACTER_TYPE_002,
    } from '../../const'

    export default {
        name: 'CharacterIcon',
        props: ['type'],
        computed: {
            cls: function() {
                switch (this.type) {
                    case CHARACTER_TYPE_000:
                        return 'icon000';
                    case CHARACTER_TYPE_001:
                        return 'icon001';
                    case CHARACTER_TYPE_002:
                        return 'icon002';
                    default:
                        return 'icon000';
                }
            }
        }
    }
</script>

<style scoped lang="scss">
    .icon {
        display: inline-block;
        width: 100%;
        height: 100%;
        background-repeat: no-repeat;
        background-position: center;
        background-size: contain;
    }
    .icon000 {
        background-image: url('./icon000.png');
    }
    .icon001 {
        background-image: url('./icon001.png');
    }
    .icon002 {
        background-image: url('./icon002.png');
    }
</style>
