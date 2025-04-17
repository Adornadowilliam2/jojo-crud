import { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Card,
  Button,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  TextField,
} from '@mui/material';
import './App.css';
import { useDropzone } from 'react-dropzone';
import { toast } from "react-toastify"

function App() {
  const [addDialog, setAddDialog] = useState(false);
  const [data, setData] = useState([]);
  const [fullname, setFullname] = useState('');
  const [standName, setStandName] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [editDialog, setEditDialog] = useState(null);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles) => {
      setImageFile(acceptedFiles[0]);
    },
    accept: 'image/*',
  });


  useEffect(() => {
    const savedData = JSON.parse(localStorage.getItem('jojoCharacters') || '[]');
    setData(savedData);
  }, []);
  const saveToLocalStorage = (characters) => {
    localStorage.setItem('jojoCharacters', JSON.stringify(characters));
  };

  const onSubmit = () => {
    const body = {
      fullname,
      standName,
      image: imageFile ? URL.createObjectURL(imageFile) : null,
    };

    const existingData = JSON.parse(localStorage.getItem('jojoCharacters') || '[]');
    const updatedData = [...existingData, body];
    alert("Added Successfully!")

    localStorage.setItem('jojoCharacters', JSON.stringify(updatedData));
    setData(updatedData);






  };

  const resetForm = () => {
    setAddDialog(false);
    setFullname('');
    setStandName('');
    setImageFile(null);
  }

  const handleCardDoubleClick = (index) => {
    const item = data[index];
    setFullname(item.fullname);
    setStandName(item.standName);
    setImageFile(null); 
    setEditDialog(index);
    setAddDialog(true);
  };

  const handleDelete = () => {
    if (editDialog === null) return;

    const updatedData = data.filter((_, idx) => idx !== editDialog);
    saveToLocalStorage(updatedData);
    setData(updatedData);
    toast.success("Character deleted!");
    resetForm();
  };


  return (
    <Container>
      <Box>
        <Typography sx={{ textAlign: 'center', mt: 4 }} variant="h4">
          Characters in JoJo's Bizarre Adventure
        </Typography>
      </Box>

      <Box sx={{ mt: 4 }}>
        {data.length === 0 ? (
          <Typography>No characters yet. Add one!</Typography>
        ) : (
          data.map((item, index) => (
            <Card key={index} sx={{ p: 2, mb: 2, border: '1px solid black' }} onDoubleClick={() => handleCardDoubleClick(index)}>
              <Typography variant="h6">{item.fullname}</Typography>
              <Typography variant="body2">Stand: {item.standName}</Typography>
              {item.image && (
                <img
                  src={item.image}
                  alt={item.fullname}
                  style={{ width: 100, height: 'auto', marginTop: 8 }}
                />
              )}
            </Card>
          ))
        )}
      </Box>

      <Box sx={{ mt: 4 }}>
        <Button variant="contained" onClick={() => setAddDialog(true)}>
          Add Character
        </Button>
      </Box>

      <Dialog open={addDialog} onClose={resetForm} component="form" onSubmit={onSubmit}>
        <DialogTitle>
          {editDialog !== null ? "Edit Character" : "Add a character to the list"}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <TextField
              label="Fullname"
              size="small"
              required
              fullWidth
              value={fullname}
              onChange={(e) => setFullname(e.target.value)}
            />
          </Box>
          <Box sx={{ mt: 2 }}>
            <TextField
              label="Stand name"
              size="small"
              required
              fullWidth
              value={standName}
              onChange={(e) => setStandName(e.target.value)}
            />
          </Box>
          <Box
            sx={{ mt: 2 }}
            {...getRootProps()}
            style={{ border: '2px dashed #aaa', padding: '10px', cursor: 'pointer' }}
          >
            <input {...getInputProps()} />
            {imageFile ? (
              <Typography variant="body2">Selected file: {imageFile.name}</Typography>
            ) : (
              <Typography variant="body2">Drag and drop an image, or click to select one</Typography>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          {editDialog !== null && (
            <Button variant="contained" color="error" onClick={handleDelete}>
              Delete
            </Button>
          )}
          <Button variant="contained" color="success" type="submit">
            {editDialog !== null ? "Update" : "Submit"}
          </Button>
          <Button variant="contained" onClick={resetForm}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default App;
