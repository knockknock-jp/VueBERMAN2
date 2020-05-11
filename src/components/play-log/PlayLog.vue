<template>
    <ul class="list-ul">
        <template v-for="info in playLog">
            <li>
                <template v-if="info.date">
                    <span v-bind:style="getStyle(info.type)">{{formatDate(info.date)}}</span>
                </template>
                <template v-if="info.name">
                    <span v-bind:style="getStyle(info.type)">{{info.name + ' :'}}</span>
                </template>
                <template v-if="info.message">
                    <span v-bind:style="getStyle(info.type)">{{info.message}}</span>
                </template>
            </li>
        </template>
    </ul>

</template>

<script>
    import {
        PLAY_LOG_TYPE_NORMAL,
        PLAY_LOG_TYPE_EMPHASIS,
        PLAY_LOG_TYPE_ATTENTION,
    } from '../../const'

    export default {
        name: 'PlayLog',
        methods: {
            formatDate: function(timestamp) {
                const date = new Date(timestamp);
                return date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes();
            },
            getStyle: function(type) {
                switch (type) {
                    case PLAY_LOG_TYPE_NORMAL:
                        return {
                            color: '#ffffff',
                        }
                        break;
                    case PLAY_LOG_TYPE_EMPHASIS:
                        return {
                            fontWeight: 'bold',
                            color: '#258e20',
                        }
                        break;
                    case PLAY_LOG_TYPE_ATTENTION:
                        return {
                            fontWeight: 'bold',
                            color: '#ff0000',
                        }
                        break;
                }
            },
        },
        computed: {
            playLog: function() {
                return this.$store.state.playLog;
            },
        }
    }
</script>

<style scoped lang="scss">
    .list-ul {
        overflow: hidden;
        overflow-y: auto;
        width: 100%;
        height: 100%;
        & > li {
            margin-bottom: 10px;
            display: table;
            color: #ccc;
            font-size: 10px;
            & > span {
                display: table-cell;
                vertical-align: top;
                text-align: left;
                padding-left: 10px;
            }
        }
    }
</style>
