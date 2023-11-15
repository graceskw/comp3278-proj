import * as React from 'react';
import {
	Accordion,
	AccordionDetails,
	AccordionSummary,
	Typography,
	Box,
	Card,
	CardActions,
	CardContent,
	Button,
	Modal,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Divider,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import './upcoming.css';
import { red } from '@mui/material/colors';

export default function ControlledAccordions() {
	const [expanded, setExpanded] = React.useState(false);

	const handleChange = (panel) => (event, isExpanded) => {
		setExpanded(isExpanded ? panel : false);
	};

	const [openZoom, setOpenZoom] = React.useState(false);
	const handleOpenZoom = () => setOpenZoom(true);
	const handleCloseZoom = () => setOpenZoom(false);

	const [openEmail, setOpenEmail] = React.useState(false);
	const handleOpenEmail = () => setOpenEmail(true);
	const handleCloseEmail = () => setOpenEmail(false);
	const [db, setData] = React.useState(null);
	  React.useEffect(() => {
		fetchData();
	  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/get_course_data');
      const jsonData = await response.json();
      setData(jsonData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  
/*   const db = {
 	upcomingCourse: 'Null',
	upcomingCourseTime: '1:30pm-3:20pm',
	upcomingCourseLocation: 'MWT1',
	teacherMessage: 'Nulla facilisi. Phasellus sollicitudin nulla et quam mattis feugiat. Aliquam eget maximus est, id dignissim quam.',
	general: 'Nulla facilisi. Phasellus sollicitudin nulla et quam mattis feugiat. Aliquam eget maximus est, id dignissim quam.',
	lectureNotes: 'Donec placerat, lectus sed mattis semper, neque lectus feugiat lectus, varius pulvinar diam eros in elit. Pellentesque convallis laoreet laoreet.',
	tutorialNotes: 'Nunc vitae orci ultricies, auctor nunc in, volutpat nisl. Integer sit amet egestas eros, vitae egestas augue. Duis vel est augue.',
	otherMaterials: 'Nunc vitae orci ultricies, auctor nunc in, volutpat nisl. Integer sit amet egestas eros, vitae egestas augue. Duis vel est augue.',
  } */
  if (db === null) {
	return <div>Loading...</div>; // Or any other loading indicator
  }
	const sendEmail = () => {
		setOpenEmail(false);
		fetch(`http://localhost:5000/sendEmail/${sessionStorage.getItem("user")}`, {
            method: 'GET',
        })
        .then(() => {
			// console.log('response:',response);
			alert('Email sent successfully!');
        })        
        .catch(function(error) {
	        console.error('Error sending the email in backend: ', error);
        });
	}

	return (
		<div>
			<Card sx={{ minWidth: 275}} className='acrylic'>
				<CardContent>
					<Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
						Upcoming Course:
					</Typography>
					{/* change to data from db later */}
					<Typography variant="h5" component="div">
						{db.upcomingCourse}
					</Typography>
					<Typography variant="body1">
						{db.upcomingCourseTime}
					</Typography>
					<Typography variant="body1">
						{db.upcomingCourseLocation}
					</Typography>
				</CardContent>

				<div style={{ display: "flex", justifyContent: "space-evenly", maxWidth: "60%", margin: "auto", marginBottom: 20 }}>
					<Button variant="contained" onClick={handleOpenZoom}>Zoom links</Button>
					<Button variant="contained" onClick={handleOpenEmail}>Send to email</Button>
				</div>

				<Dialog
					maxWidth='md'
					fullWidth={true}
					open={openZoom}
					onClose={handleCloseZoom}
					aria-labelledby="modal-modal-title"
					aria-describedby="modal-modal-description"
				>
					<DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">Zoom links</DialogTitle>
					<IconButton
						aria-label="close"
						onClick={handleCloseZoom}
						sx={{
							position: 'absolute',
							right: 8,
							top: 8,
							color: (theme) => theme.palette.grey[500],
						}}
					>
						<CloseIcon />
					</IconButton>
					<DialogContent dividers>
						<Typography gutterBottom>
							<a href="https://www.google.com" target='_blank' rel='noreferrer'>Thursday, November 9, 2023 at 1:26:41 PM</a>
						</Typography>
						<Divider />
						<Typography gutterBottom>
							<a href="https://www.google.com" target='_blank' rel='noreferrer'>Monday, November 6, 2023 at 2:24:26 PM</a>
						</Typography>
						<Divider />
						<Typography gutterBottom>
							<a href="https://www.google.com" target='_blank' rel='noreferrer'>Thursday, November 2, 2023 at 1:23:54 PM</a>
						</Typography>
					</DialogContent>
				</Dialog>

				<Dialog
					maxWidth='md'
					fullWidth={true}
					open={openEmail}
					onClose={handleCloseEmail}
					aria-labelledby="modal-modal-title"
					aria-describedby="modal-modal-description"
				>
					<DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">Email details</DialogTitle>
					<IconButton
						aria-label="close"
						onClick={handleCloseEmail}
						sx={{
							position: 'absolute',
							right: 8,
							top: 8,
							color: (theme) => theme.palette.grey[500],
						}}
					>
						<CloseIcon />
					</IconButton>
					<DialogContent dividers>
						<Typography gutterBottom>
							{db.upcomingCourse} <br />
							{db.upcomingCourseTime}<br />
							{db.upcomingCourseLocation}
						</Typography>
					</DialogContent>
					<DialogActions>
						<Button onClick={handleCloseEmail} sx={{ backgroundColor: "red", color: 'black' }}>Cancel</Button>
						<Button onClick={sendEmail} variant='outlined'>Send</Button>
					</DialogActions>
				</Dialog>

			</Card>

			<Accordion expanded={expanded === 'msg'} onChange={handleChange('msg')} sx={accordionStyle}>
				<AccordionSummary
					expandIcon={<ExpandMoreIcon />}
					aria-controls="msg-content"
					id="msg-header"
				>
					<Typography sx={{ width: '33%', flexShrink: 0 , background:'none'}} >
						Teacher's message
					</Typography>
				</AccordionSummary>
				<AccordionDetails>
					<Typography>
						{db.teacherMessage}
					</Typography>
				</AccordionDetails>
			</Accordion>

			<Accordion expanded={expanded === 'general'} onChange={handleChange('general')} sx={accordionStyle}>
				<AccordionSummary
					expandIcon={<ExpandMoreIcon />}
					aria-controls="general-content"
					id="general-header"
				>
					<Typography sx={{ width: '33%', flexShrink: 0 }}>
						General
					</Typography>
				</AccordionSummary>
				<AccordionDetails>
					<Typography>
						{db.general}
					</Typography>
				</AccordionDetails>
			</Accordion>

			<Accordion expanded={expanded === 'lecture'} onChange={handleChange('lecture')} sx={accordionStyle}>
				<AccordionSummary
					expandIcon={<ExpandMoreIcon />}
					aria-controls="lecture-content"
					id="lecture-header"
				>
					<Typography sx={{ width: '33%', flexShrink: 0 }}>Lecture notes</Typography>
				</AccordionSummary>
				<AccordionDetails>
					<Typography>
						{db.lectureNotes}
					</Typography>
				</AccordionDetails>
			</Accordion>

			<Accordion expanded={expanded === 'tutorial'} onChange={handleChange('tutorial')} sx={accordionStyle}>
				<AccordionSummary
					expandIcon={<ExpandMoreIcon />}
					aria-controls="tutorial-content"
					id="tutorial-header"
				>
					<Typography sx={{ width: '33%', flexShrink: 0 }}>
						Tutorial notes
					</Typography>
					{/* <Typography sx={{ color: 'text.secondary' }}>
			Filtering has been entirely disabled for whole web server
		  </Typography> */}
				</AccordionSummary>
				<AccordionDetails>
					<Typography>
						{db.tutorialNotes}
					</Typography>
				</AccordionDetails>
			</Accordion>

			<Accordion expanded={expanded === 'otherMaterials'} onChange={handleChange('otherMaterials')} sx={accordionStyle}>
				<AccordionSummary
					expandIcon={<ExpandMoreIcon />}
					aria-controls="otherMaterials-content"
					id="otherMaterials-header"
				>
					<Typography sx={{ width: '33%', flexShrink: 0 }}>Other materials</Typography>
				</AccordionSummary>
				<AccordionDetails>
					<Typography>
						{db.otherMaterials}
					</Typography>
				</AccordionDetails>
			</Accordion>
		</div>
	);
}

const accordionStyle = {
	// backgroundColor:'#9dc8f3', 
	borderRadius: 3,
	borderWidth: 2,
	borderColor: '#1976d2',
	borderStyle: 'outset',
	margin: 0.5,
};