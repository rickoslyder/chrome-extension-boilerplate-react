import React from 'react';
import { makeStyles } from '@mui/styles';
import { Divider, Typography, useMediaQuery } from '@mui/material';

const useStyles = makeStyles(theme => ({
    title: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        color: '#1a1a1a',
        fontWeight: '800',
        textShadow: '2px 2px #c4ff61',
        lineHeight: 1,
        flexGrow: 1,
        width: '90%',
        textOverflow: 'ellipsis',
        textAlign: 'center',
        overflow: 'hidden',
    },
    overlay: {
        position: 'relative',
        background: 'linear-gradient(to bottom, #d7ff94, #b1ff2e)',
        // minHeight: '20vh',
        height: '6rem',
        minWidth: '90%',
        maxWidth: '100%',
        padding: '5vh'
    }
}));

const Title = ({ title, noDivider }: { title: string, noDivider?: boolean }) => {
    const classes = useStyles();

    const isMini = useMediaQuery("(max-width:375px)")
    const isMobile = useMediaQuery("(max-width:650px)")
    const isTablet = useMediaQuery("(max-width:1000px)")

    // const widthRenderer = (normal: string, mobile: string, mini?: string) => {
    //     if (mini && isMini) {
    //         return mini
    //     } else if (mobile && isMobile) {
    //         return mobile
    //     } else {
    //         return normal
    //     }
    // }

    return (
        <>
            <div className={classes.overlay}>
                <Typography className={classes.title} variant={'h4'} component={isMini ? 'h3' : isMobile ? 'h2' : 'h1'}>
                    {title}
                </Typography>
            </div>
            <br />
            {!noDivider && <><Divider />
                <br /></>}
        </>
    );
};

export default Title;