import { makeStyles } from '@material-ui/styles'

const useStyles = makeStyles(theme => ({
    title: {
        // color: theme.palette.primary.main,
        textTransform: 'capitalize',
        textAlign: 'center',
        marginBottom: theme.spacing(3)
    },
    paper: {
        marginTop: theme.spacing(8),
        padding: theme.spacing(6),
    },
    buttons: {
        marginTop: theme.spacing(4)
    },
    forgotPassword: {
        marginTop: theme.spacing(3)
    }
}));

export default useStyles;