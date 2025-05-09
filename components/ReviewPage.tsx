import { Button, Paper, Typography, List, ListItem, ListItemText, Divider } from '@mui/material';
import { useFormContext } from '../context/FormContext';

interface ReviewPageProps {
  onEditPage: (pageIndex: number) => void;
}

const ReviewPage = ({ onEditPage }: ReviewPageProps) => {
  const { formData, totalPages } = useFormContext(); // Use your custom context

  // This needs to align with how you've structured `formPagesConfig` and `pageKey` in modules
  // For simplicity, we'll iterate through formData.
  // A more robust solution would map `formPagesConfig` to display data.

  return (
    <Paper elevation={3} className="p-6 my-8">
      <Typography variant="h4" component="h2" gutterBottom className="text-gray-700">
        Review Your Application
      </Typography>
      <Typography variant="body1" gutterBottom className="mb-6">
        Please review your information below before submitting.
      </Typography>

      {Object.entries(formData).map(([pageKey, pageData], pageIndex) => (
        <div key={pageKey} className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <Typography variant="h6" className="text-blue-600 capitalize">
              {/* Attempt to get a title, otherwise use pageKey */}
              {/* This part needs better mapping from pageKey to actual page titles */}
              Section: {pageKey.replace(/([A-Z])/g, ' $1').trim()}
            </Typography>
            <Button variant="text" onClick={() => onEditPage(pageIndex)}> {/* Ensure pageIndex is correct */}
              Edit
            </Button>
          </div>
          <List dense component={Paper} variant="outlined" className="p-2">
            {typeof pageData === 'object' && pageData !== null ? (
              Object.entries(pageData).map(([key, value]) => (
                value !== undefined && value !== '' && ( // Don't display empty fields
                  <>
                    <ListItem key={key}>
                      <ListItemText
                        primary={<span className="font-semibold capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>}
                        secondary={Array.isArray(value) ? value.join(', ') : String(value)}
                      />
                    </ListItem>
                    <Divider component="li" />
                  </>
                )
              ))
            ) : (
              <ListItem>
                <ListItemText primary={String(pageData)} />
              </ListItem>
            )}
          </List>
        </div>
      ))}
    </Paper>
  );
};

export default ReviewPage;