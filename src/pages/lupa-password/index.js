import React, { useState } from 'react'

// import material-ui
import Container from '@material-ui/core/Container'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button';

// import styles
import useStyles from './styles';
// react router-dom
import { Link, Redirect } from 'react-router-dom'
// validasi
import isEmail from 'validator/lib/isEmail';
// firebase hook
import { useFirebase } from '../../components/FirebaseProvider';
// loading
import AppLoading from '../../components/AppLoading'
// notistack hook
import { useSnackbar } from 'notistack'



export default function LupaPassword () {
    const classes = useStyles();

    // form
    const [form, setForm] = useState({
        email: ''
    });

    // error
    const [error, setError] = useState({
        email: ''
    })

    const [isSubmiting, setSubmitting] = useState(false)

    // auth firebase
    const { auth, user, loading } = useFirebase();

    // snackbar
    const { enqueueSnackbar } = useSnackbar();

    // handle form
    const handleChange = e => {

        // change form
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });

        // change error
        setError({
            ...error,
            [e.target.name]: ''
        });
    }

    // form validasi
    const validate = () => {
        const newError = { ...error };

        if (!form.email) {
            newError.email = 'Email wajib diisi';
        } else if (!isEmail(form.email)) {
            newError.email = 'Email tidak valid';
        }
        return newError;
    }

    // handle submit
    const handleSubmit = async e => {
        e.preventDefault();
        const findErrors = validate();

        if (Object.values(findErrors).some(err => err !== '')) {
            setError(findErrors);
        } else {
            try {
                setSubmitting(true);
                const actionCode = {
                    url: `${window.location.origin}/login`
                }
                await auth.sendPasswordResetEmail(form.email, actionCode)
                enqueueSnackbar(`Cek kotak masuk email ${form.email}, sebuah tautan untuk me-reset password telah dikirim `, {
                    variant: 'success'
                })
                setSubmitting(false);
            } catch (e) {
                const newError = {};

                switch (e.code) {
                    case 'auth/user-not-found':
                        newError.email = 'Email tidak terdaftar'
                        break;
                    case 'auth/invalid-email':
                        newError.email = 'Email tidak valid'
                        break;
                    default:
                        newError.email = 'Terjadi kesalahan jaringan silahkan coba lagi'
                        break;
                }
                setError(newError);
                setSubmitting(false);
            }
        }
    }

    if (loading) {
        return <AppLoading />
    }
    if (user) {
        return <Redirect to="/" />
    }

    return <Container maxWidth="xs">
        <Paper className={classes.paper}>
            <Typography
                variant="h5"
                component="h1"
                className={classes.title}>Lupa Password</Typography>
            <form onSubmit={handleSubmit} noValidate>
                <TextField id="email"
                    type="email"
                    name="email"
                    margin="normal"
                    label="Alamat Email"
                    fullWidth
                    required
                    value={form.email}
                    onChange={handleChange}
                    helperText={error.email}
                    error={error.email ? true : false}
                    disabled={isSubmiting}
                />

                <Grid container className={classes.buttons}>
                    <Grid item xs>
                        <Button type="submit" color="primary" variant="contained" size="large" disabled={isSubmiting}>Kirim</Button>
                    </Grid>
                    <Grid item>
                        <Button disabled={isSubmiting} component={Link} variant="contained" size="large" to="/login">Login</Button>
                    </Grid>
                </Grid>
            </form>
        </Paper>
    </Container>
}

