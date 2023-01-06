import React from "react";
import { Container, Typography, Button, Link, Divider } from "@mui/material";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles({
    container: {
        display: "flex !important",
        flexDirection: "column",
        justifyContent: "center",
        justifyItems: "center",
        alignItems: 'center',
        // margin: "60px 50%",
        width: '100%'
    },
    title: {
        fontSize: "2rem",
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: "30px",
    },
    text: {
        fontSize: "1.1rem",
        textAlign: "center",
        marginBottom: "40px",
    },
    button: {
        backgroundColor: "#1976d2",
        color: "white",
        "&:hover": {
            backgroundColor: "#004ba0",
        },
        width: '100%'
    }
});

const SignInRequired = () => {
    const classes = useStyles();
    return (
        <>
            <br /><br />
            <Divider />
            <br />
            <Container className={classes.container}>
                <Typography className={classes.title} variant="h4">
                    Sign In Required
                </Typography>
                <br />
                <Typography className={classes.text} variant="body1">
                    Sorry, you need to be signed in to access this page. Don't have an account yet? No problem - click the button below to create one!
                </Typography>
                <br />
                <Button className={classes.button} variant="contained">
                    <Link href="/auth#auth-sign-up" color="inherit">
                        Create Account
                    </Link>
                </Button>
                <br />
                <Button className={classes.button} variant="contained">
                    <Link href="/auth" color="inherit">
                        Sign In
                    </Link>
                </Button>
            </Container>
        </>
    );
};

export default SignInRequired;