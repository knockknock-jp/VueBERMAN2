<template>
    <div class="container">
        <ul class="list-ul" v-bind:style="{width: ($store.state.users.length * 110) + 'px'}">
            <template v-for="user in users">
                <li>
                    <UserInfo v-bind:uid="user.uid"/>
                </li>
            </template>
        </ul>
    </div>
</template>

<script>
    import UserInfo from './user-info/UserInfo';

    export default {
        name: 'UsersInfo',
        components: {
            UserInfo,
        },
        computed: {
            users: function() {
                let arr = this.$store.state.users.concat();
                return arr.sort((a, b)=> {
                    if(a.point < b.point) return 1;
                    if(a.point > b.point) return -1;
                    return 0;
                });
            }
        }
    }
</script>

<style scoped lang="scss">
    .container {
        width: 100%;
        overflow-y: hidden;
        overflow-x: auto;
    }
    .list-ul {
        margin-right: 0;
        margin-left: auto;
        display: table;
        height: 180px;
        & > li {
            display: table-cell;
            width: 100px;
            height: 100px;
            padding-left: 10px;
            padding-top: 80px;
        }
    }
</style>
