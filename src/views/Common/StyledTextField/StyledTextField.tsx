import { TextField } from '@mui/material';
import { styled } from '@mui/system';
import { Settings } from '../../../settings/Settings';


export const StyledTextField = styled(TextField)({
    '& .MuiInputBase-root': {
        color: 'white',
    },
    '& label': {
        color: 'white',
    },
    '& .MuiInput-underline:before': {
        borderBottomColor: 'white',
    },
    '& .MuiInput-underline:hover:before': {
        borderBottomColor: 'white',
    },
    '& label.Mui-focused': {
        color: Settings.SECONDARY_COLOR,
    },
    '& .MuiInput-underline:after': {
        borderBottomColor: Settings.SECONDARY_COLOR,
    }
});