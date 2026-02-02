<template>
    <div style="padding: 30px 85px">
        <h1 style="
            font-size: 28px;
            font-style: normal;
            font-weight: 700;
            line-height: 39px;
            letter-spacing: 0em;
            text-align: center;
        "
        >
            Congratulations
        </h1>

        <p style="
            margin-top: 10px;
            margin-bottom: 30px;
            font-size: 20px;
            font-style: normal;
            font-weight: 400;
            line-height: 27px;
            letter-spacing: 0em;
            text-align: center;
            color: #A5B3BF;
        "
        >
            Your account has been successfully created!
            <br />
            Please check your email for account verification
        </p>

        <v-btn
            id="submit"
            block
            height="50"
            depressed
            color="secondary"
            class="mr-4 text-capitalize font-weight-bold"
            @click="closeDialog"
        >
            Ok
        </v-btn>
    </div>
</template>

<script>
export default {
    methods: {
        closeDialog() {
            this.$router.push('/')
        },
    }
}
</script>