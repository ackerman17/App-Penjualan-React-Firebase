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
import { Link } from 'react-router-dom'
// validasi
import isEmail from 'validator/lib/isEmail';

export default function Registrasi () {
    const classes = useStyles();

    // form
    const [form, setForm] = useState({
        email: '',
        password: '',
        konfirmasi_password: ''
    });

    // error
    const [error, setError] = useState({
        email: '',
        password: '',
        konfirmasi_password: ''
    })

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
            [e.target.name]: '',
            [e.target.password]: '',
            [e.target.konfirmasi_password]: '',
        });
    }

    // form validasi
    const validate = () => {
        const newError = { ...error };

        if (!form.email) {
            newError.email = 'Email wajib diisi';
        } else if (!isEmail(form.email)) {
            newError.email = 'Email tidak valide';
        }

        if (!form.password) {
            newError.password = 'Password wajib diisi';
        }

        if (!form.konfirmasi_password) {
            newError.konfirmasi_password = 'Konfirmasi Password wajib diisi';
        } else if (form.konfirmasi_password !== form.password) {
            newError.konfirmasi_password = "Konfirmasi Password tidak sama dengan password";
        }

        return newError;
    }

    // handle submit
    const handleSubmit = e => {
        e.preventDefault();
        const findErrors = validate();

        if (Object.keys(findErrors).some(err => err !== '')) {
            setError(findErrors);
        }
    }

    return <Container maxWidth="xs">
        <Paper className={classes.paper}>
            <Typography
                variant="h5"
                component="h1"
                className={classes.title}>Buat Akun Baru</Typography>
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
                />
                <TextField id="password"
                    type="password"
                    name="password"
                    margin="normal"
                    label="Password"
                    fullWidth
                    required
                    value={form.password}
                    onChange={handleChange}
                    helperText={error.password}
                    error={error.password ? true : false}
                />
                <TextField id="konfirmasi_password"
                    type="password"
                    name="konfirmasi_password"
                    margin="normal"
                    label="Konfirmasi Password"
                    fullWidth
                    required
                    value={form.konfirmasi_password}
                    onChange={handleChange}
                    helperText={error.konfirmasi_password}
                    error={error.konfirmasi_password ? true : false}
                />
                <Grid container className={classes.buttons}>
                    <Grid item xs>
                        <Button type="submit" color="primary" variant="contained" size="large">Daftar</Button>
                    </Grid>
                    <Grid item>
                        <Button component={Link} variant="contained" size="large" to="/login">Login</Button>
                    </Grid>
                </Grid>
            </form>
        </Paper>
    </Container>
}

