import React, { useState } from "react";
import DisplayGiphySingleGif from "./DisplayGiphySingleGif";
import {
    useMediaQuery, List,
    ListItem,
    ListItemIcon,
    Checkbox,
    ListItemText,
    LinearProgress,
    Typography,
} from "@mui/material";
import { makeStyles } from "@mui/styles"
import Title from "./Title";

const useStyles = makeStyles({
    progress: {
        width: "100%",
    },
    container: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        justifyItems: "center",
        alignItems: 'center',
        width: '100%',
        marginTop: '1em',
    },
});


const ViewingChecklist = () => {
    const classes = useStyles();
    const checklist = [
        "View property at different times of the day",
        "Imagine the property without the vendors' belongings",
        "Test furniture size with a tape measure",
        "Use all senses to check for issues",
        "Check what's behind locked doors",
        "Verify working fireplaces and recent maintenance",
        "Request copies of safety certificates",
        "Consider compromises and be realistic",
        "Confirm garden and terrace usage and maintenance responsibilities",
        "Check media installation restrictions and current providers",
    ];
    const supplementaryInfo = [
        "It might be very different at night or when all of the neighbours are at home or if you are close to a busy road or train line.",
        "You are generally not going to be buying the contents of a property, make sure you don’t end up buying into a lifestyle which is not for sale.",
        "Some developments will use smaller furniture to make rooms look bigger",
        "You can often smell damp before you can see it and the smell of good coffee might just be covering up something else!",
        "Also check that all the doors are there as they’re sometimes removed to increase the sense of space!",
        "Fireplaces are often a compelling feature. Check that they are working and when they were last serviced or the chimneys swept.",
        "If the property was previously rented, ask for copies of all the safety certificates",
        "House hunting is often a case of how you make your compromises. Walking through the door looking for perfection might leave you disappointed",
        "Whilst a communal garden may seem less attractive initially, the building owner may maintain it for you.",
        "Many buildings will be restricted as to what media can or cannot be installed (satellite TV for example). Check what arrangements are available and who the current provider is."
    ]
    const [checked, setChecked] = useState<number[]>([]);


    const handleToggle = (value: number) => () => {
        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];
        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }

        setChecked(newChecked);
    };

    const isMini = useMediaQuery("(max-width:375px)")
    const isMobile = useMediaQuery("(max-width:585px)")
    // const isTablet = useMediaQuery("(max-width:1000px)")

    const widthRenderer = (normal: number, mobile: number, mini?: number) => {
        if (mini && isMini) {
            return mini
        } else if (mobile && isMobile) {
            return mobile
        } else {
            return normal
        }
    }

    const handleProgressColour = () => {
        if (checked.length === 0) {
            return 'error'
        } else if ((checked.length > 0) && (checked.length <= (checklist.length * 0.4))) {
            return 'warning'
        } else if ((checked.length >= (checklist.length * 0.5)) && (checked.length <= (checklist.length * 0.7))) {
            return 'secondary'
        } else if ((checked.length > (checklist.length * 0.7)) && (checked.length <= (checklist.length - 1))) {
            return 'info'
        } else {
            return 'success'
        }
    }

    const allBoxesTicked = (checked.length === checklist.length)


    return (
        <>
            <Title title={"Viewing Checklist"} />
            <Typography><b>When viewing a property, it's important to consider all aspects and make sure you have a thorough understanding of what you're buying into.</b></Typography> <br /><Typography>Here are some key points to consider during your viewing:</Typography>
            <br />
            <Typography variant="h3" align="center" color={allBoxesTicked ? "#9acc32" : "inherit"}>{checked.length} / {checklist.length}</Typography>
            <div>
                <LinearProgress
                    className={classes.progress}
                    color={handleProgressColour()}
                    variant="determinate"
                    value={(checked.length / checklist.length) * 100}
                />
                <List>
                    {checklist.map((item, index) => (
                        <ListItem key={item} dense button onClick={handleToggle(index)}>
                            <ListItemIcon>
                                <Checkbox edge="start" checked={checked.indexOf(index) !== -1} tabIndex={-1} disableRipple />
                            </ListItemIcon>
                            <ListItemText primary={<b>{item}</b>} secondary={supplementaryInfo[index]} />
                        </ListItem>
                    ))}
                </List>
                <LinearProgress
                    className={classes.progress}
                    color={handleProgressColour()}
                    variant="determinate"
                    value={(checked.length / checklist.length) * 100}
                />
            </div>
            {((checked.length > (checklist.length * 0.2)) && (checked.length <= (checklist.length * 0.4))) && <div className={classes.container}>
                <DisplayGiphySingleGif gifKey="baby steps" width={widthRenderer(500, 300, 200)} />
            </div>}
            {((checked.length >= (checklist.length * 0.5)) && (checked.length <= (checklist.length * 0.7))) && <div className={classes.container}>
                <DisplayGiphySingleGif gifKey="we're making good progress" width={widthRenderer(500, 300, 200)} />
            </div>}
            {((checked.length > (checklist.length * 0.7)) && (checked.length <= (checklist.length - 1))) && <div className={classes.container}>
                <DisplayGiphySingleGif gifKey="almost there" width={widthRenderer(500, 300, 200)} />
            </div>}
            {checked.length === checklist.length && <div className={classes.container}>
                <DisplayGiphySingleGif gifKey="you did it" width={widthRenderer(500, 300, 200)} />
            </div>}
        </>
    );
};

export default ViewingChecklist;  