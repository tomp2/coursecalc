<template>
    <v-alert
        border="left"
        dense
        text
        elevation="1"
        :color="dim"
        min-height="40"
    >
        {{ block_title }}
        <div class="d-flex flex-wrap">
            <Course
                v-for="course in courses"
                :key="course.i.toString() + $store.state.keyp"
                :course="course"
            ></Course>
        </div>
    </v-alert>
</template>

<script>
import Course from "./Course";

export default {
    name: "block",
    components: { Course },
    props: ["courses", "block_title"],
    computed: {
        dim: function () {
            if (this.block_title % 2 === 1) {
                return "blue";
            } else {
                return "indigo";
            }
        },
    },
};
</script>

<style scoped></style>
