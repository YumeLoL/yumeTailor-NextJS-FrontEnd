import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import CameraIcon from '@mui/icons-material/PhotoCamera';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import styled from "styled-components";
import axiosInstance from '../api/axios';
import { getJobs } from '../api/httpRequest';
import Divider from '@mui/material/Divider';
import Pagination from '@mui/material/Pagination';
import { IJob } from '@/models/job';
import { clothType, IClothType } from '@/constant/clothType';
import { getLabelById } from '@/tools/common';
import JobCard from '@/components/JobCard';
import Layout from '@/components/Layout'


function Copyright() {
  return (
    <Typography variant="body2" color="text.secondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}


const theme = createTheme()


const MakerList = () => {
  const [pagination, setPagination] = React.useState({
    page: 1,
    limit: 10,
  })
  const [jobData, setJobData] = React.useState<any>();


  // paginate all jobs with filter by location and cloth type
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getJobs({
          page: pagination.page,
          limit: pagination.limit,
        });
        if (response.data.status === 200) {
          setJobData(response.data.data)
        }
      } catch (error) {
        console.log('error:', error)
      }
    }

    fetchData();
  }, [pagination])


  return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <main>
          {/* Hero unit */}
          <Box
            sx={{
              bgcolor: 'background.paper',
              pt: 8,
              pb: 6,
            }}
          >
            <Container maxWidth="sm">
              <Typography
                component="h1"
                variant="h2"
                align="center"
                color="text.primary"
                gutterBottom
              >
                All Makers
              </Typography>
              <Typography variant="h5" align="center" color="text.secondary" paragraph>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut.
              </Typography>
            </Container>
          </Box>
          <Container sx={{ py: 8 }} maxWidth="md">
            {/* End hero unit */}
            <Grid container spacing={4}>
              {/* {jobData?.data.length > 0 && jobData.data.map((card: IJob) => (
                <Grid item key={card.id} xs={12} sm={6} md={4}>
                  <JobCard card={card} />
                </Grid>
              ))} */
              }
            </Grid>
            <Stack spacing={2} justifyContent="center"
              alignItems="center" margin="40px" >
              <Pagination count={10} variant="outlined" color="primary" />
            </Stack>
          </Container>
        </main>
        {/* Footer */}
        <Box sx={{ bgcolor: 'background.paper', p: 6 }} component="footer">
          <Typography variant="h6" align="center" gutterBottom>
            Footer
          </Typography>
          <Typography
            variant="subtitle1"
            align="center"
            color="text.secondary"
            component="p"
          >
            Something here to give the footer a purpose!
          </Typography>
          <Copyright />
        </Box>
        {/* End footer */}
      </ThemeProvider>
  );
}

export default MakerList