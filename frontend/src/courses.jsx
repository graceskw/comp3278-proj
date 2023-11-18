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
import './courses.css';
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
	const [enrolledCourses, setCourseNames] = React.useState(null);
	const [enrolledCourseIds, setCourseIds] = React.useState(null);
	const [course_data, setData2] = React.useState(null);
	const [lectureNotes, setLectureNotes] = React.useState(null);
	const [tutorialNotes, setTutorialNotes] = React.useState(null);
	const [otherMaterials, setOtherMaterials] = React.useState(null);
	
	  React.useEffect(() => {
		fetchData();
	  }, []);
	
  const fetchData = async () => {
    try {
		// console.log('sessionStorage.getItem', sessionStorage.getItem('user'))
      const response = await fetch(`http://localhost:5000/get_enrolled_courses/${sessionStorage.getItem('user')}`);
    //   const response = await fetch(`http://localhost:5000/api/get_course_data/${sessionStorage.getItem('user')}`); // TODO: Replace '0' with user id.
    //   const response = await fetch('http://localhost:5000/api/get_course_data/0'); // TODO: Replace '0' with user id.
		// console.log('response', response.json())
		const jsonData = await response.json();
		console.log('jsonData', jsonData)
      setData(jsonData);
		setCourseNames(jsonData.course_names)
		setCourseIds(jsonData.course_ids)
	//   console.log('jsonData', jsonData)
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  if (db === null) {
	return <div>Loading...</div>; // Or any other loading indicator
  }

	  return (
		<div>
			<Card sx={{ minWidth: 275}} className='acrylic'>
				<CardContent>
					<Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
						
					</Typography>
					{/* change to data from db later */}
					<Typography variant="h5" component="div">
						Enrolled Courses:
						{/* {db.upcomingCourse} */}
					</Typography>
				</CardContent>

			
		  {enrolledCourses.map((item, index) => (
							<div styleload={{ display: "flex", justifyContent: "space-evenly", maxWidth: "60%", margin: "auto", marginBottom: 80 }}>
	  <Button variant="contained" onClick={() => {
	  const target_id = enrolledCourseIds[enrolledCourses.indexOf(item)]
	    const fetchData2 = async () => {
			try {
			  const response = await fetch(`http://localhost:5000/course_info/${target_id}/tutorial`);
				const jsonData = await response.json();
				console.log('jsonData', jsonData)
				setData2(jsonData);
				setLectureNotes(jsonData.Lecture_Note)
				setTutorialNotes(jsonData.Tutorial_Note)
				setOtherMaterials(jsonData.Assignment)
			} catch (error) {
			  console.error('Error fetching data:', error);
			}
	  }
	  fetchData2();
  }}>{item}</Button>
					<Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
						
					</Typography>
				</div>
		  ))}
		  
		  				<CardContent>
					<Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
						
					</Typography>
					{/* change to data from db later */}
					<Typography variant="h5" component="div">
					</Typography>
				</CardContent>
		  
		  </Card>
		  
		  <Card sx={{ minWidth: 275}} className='acrylic'>
				

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
						{db=='N/A'? 'N/A' : <a href={db.zoom_link} target='_blank' rel='noreferrer'>{db.zoom_link}</a>}
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
							{db=='N/A'? `No upcoming course` : `${db.course_code} ${db.name}`} <br/>
							{db=='N/A'? '' : `${db.start_time} to ${db.end_time}`} <br/>
							{db=='N/A'? '' : `@${db.location}`} <br/>
							{db=='N/A'? '' : <a href={db.zoom_link} target='_blank' rel='noreferrer'>{db.zoom_link}</a>} <br/>
							{db=='N/A'? '' : `Teacher's message: ${db.message}`} <br/>
							{db=='N/A' || db.Lecture_Note==undefined? '' : `Lecture notes: ${db.Lecture_Note}`} <br/>
							{db=='N/A' || db.Tutorial_Note==undefined? '' : `Tutorial notes: ${db.Tutorial_Note}`} <br/>
							{db=='N/A' || db.Assignment==undefined? '' : `Other materials: ${db.Assignment}`} <br/>
						</Typography>
					</DialogContent>
				</Dialog>

			</Card>

			<Accordion expanded={expanded === 'lecture'} onChange={handleChange('lecture')} sx={accordionStyle}>
				<AccordionSummary
					expandIcon={<ExpandMoreIcon />}
					aria-controls="lecture-content"
					id="lecture-header"
				>
					<Typography sx={{ width: '33%', flexShrink: 0 }}>Lecture notes</Typography>
				</AccordionSummary>
				<AccordionDetails>
					<div>
						{lectureNotes == null ? 'N/A' : lectureNotes.map((item) =>
							<div>
								<a href={item} target='_blank' rel='noreferrer'>{item}</a><br/>
							</div>
						)}
					</div>
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
					<div>
						{tutorialNotes == null ? 'N/A' : tutorialNotes.map((item) =>
							<div>
								<a href={item} target='_blank' rel='noreferrer'>{item}</a><br/>
							</div>
						)}
					</div>
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
					<div>
						{otherMaterials == null ? 'N/A' : otherMaterials.map((item) =>
							<div>
								<a href={item} target='_blank' rel='noreferrer'>{item}</a><br/>
							</div>
						)}
					</div>
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