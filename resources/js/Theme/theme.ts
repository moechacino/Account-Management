import {createTheme, Theme, ThemeOptions, Palette} from "@mui/material/styles";


interface IPalette extends Palette{
    primaryLight: {
        main: string
    },
    secondaryLight: {
        main: string
    }
}
// interface ITheme extends Theme {
//     palette: IPalette;
// }
interface IThemeOptions extends ThemeOptions {
    palette: IPalette;
}


export const theme: Theme= createTheme({
    palette:{
        primary:{
            main: "#20A464"
        },
        primaryLight:{
            main: "#60BE90"
        },
        secondary:{
            main: "#EDA306"
        },
        secondaryLight:{
            main: "#F5BA14"
        }

    }
} as IThemeOptions)


