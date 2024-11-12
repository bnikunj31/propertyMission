import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import EmailIcon from '@mui/icons-material/Email';

import CallIcon from '@mui/icons-material/Call';

const StyledSpeedDial = styled(SpeedDial)(({ theme }) => ({
  position: 'fixed',
  bottom: theme.spacing(2),
  right: theme.spacing(2),
}));

// Actions with icons, names, and functionalities
const actions = [
  { 
    icon: <WhatsAppIcon  style={{color:"green"}}/>, 
    name: 'WhatsApp', 
    onClick: () => {
      const phoneNumber = '1234567890'; // Replace with actual phone number
      const message = 'Hello, I would like to inquire about...'; // Replace with actual message
      window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, '_blank');
    },
  },
  
  
  { 
    icon: <CallIcon style={{color:"blue"}} />, 
    name: 'Call Us',  // Added 'Call Us' action
    onClick: () => {
      const phoneNumber = '1234567890'; // Replace with actual phone number
      window.location.href = `tel:${phoneNumber}`;  // Calls the specified phone number
    },
    },
    { 
        icon: <EmailIcon style={{color:"red"}}/>, 
        name: 'Email', 
        onClick: () => {
          const email = 'contact@example.com'; // Replace with actual email
          const subject = 'Inquiry from Customer'; // Replace with actual subject
          const body = 'Hello, I would like to discuss...'; // Replace with actual body
          window.open(`mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
        },
      },
];

export default function PlaygroundSpeedDial() {
  return (
    <Box >
      <StyledSpeedDial
        ariaLabel="SpeedDial with WhatsApp, Email, Contact, and Call functionalities"
        icon={<SpeedDialIcon />}
        direction="up"
      >
        {actions.map((action) => (
          <SpeedDialAction 
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
            onClick={action.onClick} // Call the onClick action for each icon
          />
        ))}
      </StyledSpeedDial>
    </Box>
  );
}
