'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Form, Button, Table, DropdownButton, Dropdown, Modal } from 'react-bootstrap';
import { FaEye, FaPen, FaTrash, FaSearch } from 'react-icons/fa';





export default function Home() {
  const [owners, setOwners] = useState([]);
  const [ownerName, setOwnerName] = useState('');
  const [ownerContact, setOwnerContact] = useState('');
  const [ownerAddress, setOwnerAddress] = useState('');
  const [species, setSpecies] = useState([]);
  const [speciesName, setSpeciesName] = useState('');
  const [breeds, setBreeds] = useState([]);
  const [breedName, setBreedName] = useState('');
  const [selectedSpeciesID, setSelectedSpeciesID] = useState('');
  const [selectedOwnerID, setSelectedOwnerID] = useState('');
  const [selectedBreedID, setSelectedBreedID] = useState('');
  const [petName, setPetName] = useState('');
  const [petDOB, setPetDOB] = useState('');
  const [pets, setPets] = useState([]);
  const [filteredPets, setFilteredPets] = useState(pets);
  const [filterTitle, setFilterTitle] = useState('Filter');
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updatePetID, setUpdatePetID] = useState(null);
  const [updatePetName, setUpdatePetName] = useState('');
  const [updatePetDOB, setUpdatePetDOB] = useState('');

  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedPetID, setSelectedPetID] = useState(null);
  const [petDetails, setPetDetails] = useState(null);

  const [searchOwnerKey, setSearchOwnerKey] = useState(''); // New state for search key
  const [filteredOwners, setFilteredOwners] = useState([]);






  useEffect(() => {
    fetchOwners();
    fetchSpecies();
    fetchPets();
  }, []);

  // Fetch breeds whenever selectedSpeciesID changes
  useEffect(() => {
    if (selectedSpeciesID) {
      fetchBreedsBySpecies(selectedSpeciesID);
    } else {
      setBreeds([]); // Clear breeds if no species is selected
    }
  }, [selectedSpeciesID]);

  const fetchOwners = async () => {
    try {
      const response = await axios.get('http://localhost/PetDB/fetch_owners.php');
      setOwners(response.data);
    } catch (error) {
      console.error("There was an error fetching owners!", error);
    }
  };

  const addOwner = async () => {
    if (!ownerName || !ownerContact || !ownerAddress) {
      alert("All fields are required.");
      return; // Stop the function from executing further
    }

    try {
      await axios.post(
        'http://localhost/PetDB/insert_owners.php',
        new URLSearchParams({ ownerName, ownerContact, ownerAddress }).toString(),
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
      );
      fetchOwners();
      setOwnerName('');
      setOwnerContact('');
      setOwnerAddress('');
      alert("Owner added successfully!");
    } catch (error) {
      console.error("There was an error adding the owner!", error);
    }
  };


  const fetchSpecies = async () => {
    try {
      const response = await axios.get('http://localhost/PetDB/fetch_species.php');
      setSpecies(response.data);
    } catch (error) {
      console.error("There was an error fetching species!", error);
    }
  };

  const addSpecies = async () => {
    if (!speciesName) {
      alert("All fields are required.");
      return; // Stop the function from executing further
    }
    try {
      await axios.post('http://localhost/PetDB/insert_species.php',
        new URLSearchParams({ speciesName }).toString(),
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
      );
      fetchSpecies();
      setSpeciesName('');
      alert("Add Species Successfully!");
    } catch (error) {
      console.error("There was an error adding the species!", error);
    }
  };

  const fetchBreedsBySpecies = async (speciesID) => {
    try {
      const response = await axios.get(`http://localhost/PetDB/fetch_breeds.php?speciesID=${speciesID}`);
      setBreeds(response.data);
    } catch (error) {
      console.error("There was an error fetching breeds by species!", error);
    }
  };

  const addBreeds = async () => {
    if (!breedName) {
      alert("All fields are required.");
      return; // Stop the function from executing further
    }
    try {
      await axios.post('http://localhost/PetDB/insert_breeds.php',
        new URLSearchParams({ breedName, speciesID: selectedSpeciesID }).toString(),
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
      );
      fetchBreedsBySpecies(selectedSpeciesID); // Update breeds
      setBreedName('');
      setSelectedSpeciesID('');
      alert("Add Breed Successfully!");
    } catch (error) {
      console.error("There was an error adding the breed!", error);
    }
  };

  const fetchPets = async () => {
    try {
      const response = await axios.get('http://localhost/PetDB/fetch_pets.php'); // Adjust this URL as needed
      setFilteredPets(response.data);
    } catch (error) {
      console.error("There was an error fetching pets!", error);
    }
  };

  const addPet = async () => {
    if (!petName || !petDOB) {
      alert("All fields are required.");
      return; // Stop the function from executing further
    }
    try {
      await axios.post('http://localhost/PetDB/insert_pets.php',
        new URLSearchParams({ petName, petDOB, speciesID: selectedSpeciesID, breedID: selectedBreedID, ownerID: selectedOwnerID }).toString(),
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
      );
      fetchPets();
      setPetName('');
      setPetDOB('');
      setSelectedSpeciesID('');
      setSelectedBreedID('');
      setSelectedOwnerID('');
      alert("Add Pet Successfully!");
    } catch (error) {
      console.error("There was an error adding the pet!", error);
    }
  };



  const handleFilterSelect = async (filterKey) => {
    try {
      const response = await axios.get(`http://localhost/PetDB/order_pets.php?filter=${filterKey}`);
      setFilteredPets(response.data);
      switch (filterKey) {
        case 'owner':
          setFilterTitle('Display by Owner');
          break;
        case 'species':
          setFilterTitle('Display by Species');
          break;
        case 'breed':
          setFilterTitle('Display by Breed');
          break;
        case 'dob':
          setFilterTitle('Display by Date of Birth');
          break;
        default:
          setFilterTitle('All');
          break;
      }
    } catch (error) {
      console.error("There was an error fetching the ordered pets!", error);
    }
  };



  // Fetch the pet details and populate the update modal with pet information, including species and breed
  const fetchPetDetails = async (petID) => {
    try {
      const response = await axios.get(`http://localhost/PetDB/fetch_pet_details.php?petID=${petID}`);
      const pet = response.data;
      setUpdatePetID(pet.PetID);
      setUpdatePetName(pet.PetName);
      setUpdatePetDOB(pet.PetDateOfBirth);
      setSelectedSpeciesID(pet.SpeciesID);  // Set selected species ID
      fetchBreedsBySpecies(pet.SpeciesID);  // Fetch breeds for the selected species
      setSelectedBreedID(pet.BreedID);  // Set selected breed ID
      setShowUpdateModal(true);
    } catch (error) {
      console.error("There was an error fetching pet details!", error);
    }
  };

  const viewPetDetails = async (petID) => {
    try {
      const response = await axios.post('http://localhost/PetDB/view_pets.php',
        new URLSearchParams({ petId: petID }).toString(),
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
      );

      console.log('Response Data:', response.data); // Verify response data

      // Ensure response.data has the correct properties
      setPetDetails({
        ownerName: response.data.OwnerName,
        ownerContactDetails: response.data.OwnerContactDetails,
        ownerAddress: response.data.OwnerAddress,
        petName: response.data.PetName,
        petDateOfBirth: response.data.PetDateOfBirth,
        speciesName: response.data.SpeciesName,
        breedName: response.data.BreedName
      });

      setShowDetailsModal(true);
    } catch (error) {
      console.error('There was an error fetching the pet details!', error);
    }
  };



  // Update the pet details, including species and breed
  const updatePet = async () => {
    if (!updatePetName || !updatePetDOB || !selectedSpeciesID || !selectedBreedID) {
      alert("All fields are required.");
      return;
    }

    try {
      await axios.post('http://localhost/PetDB/update_pets.php',
        new URLSearchParams({
          petID: updatePetID,
          petName: updatePetName,
          petDOB: updatePetDOB,
          speciesID: selectedSpeciesID,  // Include species in the update
          breedID: selectedBreedID       // Include breed in the update
        }).toString(),
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
      );
      fetchPets(); // Refresh pets list
      setShowUpdateModal(false);
      alert("Pet updated successfully!");
    } catch (error) {
      console.error("There was an error updating the pet!", error);
    }
  };


  const handleDelete = async (petID) => {
    if (window.confirm("Are you sure you want to delete this pet?")) {
      try {
        await axios.post('http://localhost/PetDB/delete_pet.php',
          new URLSearchParams({ petID }).toString(),
          { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
        );
        fetchPets(); // Refresh pets list
        alert("Pet deleted successfully!");
      } catch (error) {
        console.error("There was an error deleting the pet!", error);
      }
    }
  };

  const searchOwner = async () => {
    try {
      const response = await axios.get('http://localhost/PetDB/search_owner.php', {
        params: { searchKey: searchOwnerKey }
      });
      setFilteredPets(response.data);
    } catch (error) {
      console.error("There was an error searching for pets by owner!", error);
    }
  };

  useEffect(() => {
    if (searchOwnerKey.trim() === '') {
      fetchPets(); // Fetch all pets if the search key is empty
    } else {
      searchOwner(); // Search pets by owner if the search key is provided
    }
  }, [searchOwnerKey]);

  return (
    <>
      <Container className="my-4 background-image">
        <header>
          <br />
          <h1 className='text-center'>Pet Management System</h1>
          <br />
        </header>
        <Row>
          <Col lg={4}>
            <div className="form-section">
              <h2>Add Owner</h2>
              <Form>
                <Form.Group controlId="ownerName">
                  <Form.Label>Owner Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter owner name"
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                  />
                </Form.Group>
                <Form.Group controlId="ownerContact">
                  <Form.Label>Contact</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter contact number"
                    value={ownerContact}
                    onChange={(e) => setOwnerContact(e.target.value)}
                  />
                </Form.Group>
                <Form.Group controlId="ownerAddress">
                  <Form.Label>Address</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter home address"
                    value={ownerAddress}
                    onChange={(e) => setOwnerAddress(e.target.value)}
                  />
                </Form.Group>
                <br />
                <div className="button-container">
                  <Button variant="primary" onClick={addOwner}>
                    Add Owner
                  </Button>
                </div>
              </Form>
            </div>

            <div className="form-section mt-4">
              <h2>Add Species</h2>
              <Form>
                <Form.Group controlId="speciesName">
                  <Form.Label>Species Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter species name"
                    value={speciesName}
                    onChange={(e) => setSpeciesName(e.target.value)}
                  />
                </Form.Group>
                <br />
                <div className="button-container">
                  <Button variant="primary" onClick={addSpecies}>
                    Add Species
                  </Button>
                </div>
              </Form>
            </div>

            <div className="form-section mt-4">
              <h2>Add Breed</h2>
              <Form>
                <Form.Group controlId="selectSpecies">
                  <Form.Label>Select Species</Form.Label>
                  <Form.Control
                    as="select"
                    value={selectedSpeciesID}
                    onChange={(e) => setSelectedSpeciesID(e.target.value)}
                  >
                    <option value="">Select Species</option>
                    {Array.isArray(species) && species.map(spec => (
                      <option key={spec.SpeciesID} value={spec.SpeciesID}>
                        {spec.SpeciesName}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>
                <Form.Group controlId="breedName">
                  <Form.Label>Breed Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter breed name"
                    value={breedName}
                    onChange={(e) => setBreedName(e.target.value)}
                  />
                </Form.Group>
                <br />
                <div className="button-container">
                  <Button variant="primary" onClick={addBreeds}>
                    Add Breed
                  </Button>
                </div>
              </Form>
            </div>

            <div className="form-section">
              <h2>Add Pet</h2>
              <Form>
                <Form.Group controlId="selectOwner">
                  <Form.Label>Select Owner</Form.Label>
                  <Form.Control
                    as="select"
                    value={selectedOwnerID}
                    onChange={(e) => setSelectedOwnerID(e.target.value)}
                  >
                    <option value="">Select Owner</option>
                    {Array.isArray(owners) && owners.map(owner => (
                      <option key={owner.OwnerID} value={owner.OwnerID}>
                        {owner.OwnerName}
                      </option>
                    ))}

                  </Form.Control>
                </Form.Group>
                <Form.Group controlId="selectSpecies">
                  <Form.Label>Select Species</Form.Label>
                  <Form.Control
                    as="select"
                    value={selectedSpeciesID}
                    onChange={(e) => setSelectedSpeciesID(e.target.value)}
                  >
                    <option value="">Select Species</option>
                    {Array.isArray(species) && species.map(spec => (
                      <option key={spec.SpeciesID} value={spec.SpeciesID}>
                        {spec.SpeciesName}
                      </option>
                    ))}


                  </Form.Control>
                </Form.Group>
                <Form.Group controlId="selectBreed">
                  <Form.Label>Select Breed</Form.Label>
                  <Form.Control
                    as="select"
                    value={selectedBreedID}
                    onChange={(e) => setSelectedBreedID(e.target.value)}
                    disabled={!breeds.length} // Disable if no species selected
                  >
                    <option value="">Select Breed</option>
                    {Array.isArray(breeds) && breeds.map(breed => (
                      <option key={breed.BreedID} value={breed.BreedID}>
                        {breed.BreedName}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>
                <Form.Group controlId="petName">
                  <Form.Label>Pet Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter pet name"
                    value={petName}
                    onChange={(e) => setPetName(e.target.value)}
                  />
                </Form.Group>
                <Form.Group controlId="petDOB">
                  <Form.Label>Date of Birth</Form.Label>
                  <Form.Control
                    type="date"
                    value={petDOB}
                    onChange={(e) => setPetDOB(e.target.value)}
                  />
                </Form.Group>
                <br />
                <div className="button-container">
                  <Button variant="primary" onClick={addPet}>
                    Add Pet
                  </Button>
                </div>
              </Form>
            </div>
          </Col>

          <Col lg={8}>
            <div className="table-section">
              <div className="d-flex justify-content-between align-items-center">
                <h2>All Pets</h2>
                <DropdownButton
                  id="filterDropdown"
                  title={filterTitle}
                  variant="primary"
                  align="end"
                  onSelect={handleFilterSelect}
                >
                  <Dropdown.Item eventKey="all">All</Dropdown.Item>
                  <Dropdown.Item eventKey="owner">Display by Owner</Dropdown.Item>
                  <Dropdown.Item eventKey="species">Display by Species</Dropdown.Item>
                  <Dropdown.Item eventKey="breed">Display by Breed</Dropdown.Item>
                  <Dropdown.Item eventKey="dob">Display by Date of Birth</Dropdown.Item>
                </DropdownButton>
              </div>
              <Row className="d-flex align-items-center">
                <Col md={10} className="d-flex align-items-center">
                  <FaSearch className="me-2" /> 
                  <Form.Control
                    type="search"
                    placeholder="Search Owners"
                    size="sm"
                    className="m-0 w-50" 
                    value={searchOwnerKey}
                    onChange={(e) => setSearchOwnerKey(e.target.value)}
                  />
                </Col>
              </Row>

              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Owner's Name</th>
                    <th>Pet Name</th>
                    <th>Species</th>
                    <th>Breed</th>
                    <th>Date Of Birth</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPets.map(pet => (
                    <tr key={pet.PetID}>
                      <td>{pet.OwnerName}</td>
                      <td>{pet.PetName}</td>
                      <td>{pet.SpeciesName}</td>
                      <td>{pet.BreedName}</td>
                      <td>{pet.PetDateOfBirth}</td>
                      <td>
                        <Button
                          variant="link"
                          onClick={() => viewPetDetails(pet.PetID)}
                          className="icon-button"
                        >
                          <FaEye />
                        </Button>{' '}
                        <Button
                          variant="link"
                          onClick={() => fetchPetDetails(pet.PetID)}
                          className="icon-button"
                        >
                          <FaPen />
                        </Button>{' '}
                        <Button
                          variant="link"
                          onClick={() => handleDelete(pet.PetID)}
                          className="icon-button"
                        >
                          <FaTrash />
                        </Button>
                      </td>

                    </tr>
                  ))}
                </tbody>

              </Table>
            </div>

          </Col>

          {/* Pet Details Modal */}
          <Modal show={showDetailsModal} onHide={() => setShowDetailsModal(false)}>
            <Modal.Header closeButton>
              <Modal.Title>Pet Details</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {petDetails ? (
                <div>
                  <h5>Owner Information</h5>
                  <p><strong>Name:</strong> {petDetails.ownerName}</p>
                  <p><strong>Contact Details:</strong> {petDetails.ownerContactDetails}</p>
                  <p><strong>Address:</strong> {petDetails.ownerAddress}</p>

                  <h5>Pet Information</h5>
                  <p><strong>Name:</strong> {petDetails.petName}</p>
                  <p><strong>Date of Birth:</strong> {petDetails.petDateOfBirth}</p>

                  <h5>Species & Breed</h5>
                  <p><strong>Species:</strong> {petDetails.speciesName}</p>
                  <p><strong>Breed:</strong> {petDetails.breedName}</p>
                </div>
              ) : (
                <p>Loading pet details...</p>
              )}
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowDetailsModal(false)}>
                Close
              </Button>
            </Modal.Footer>
          </Modal>


          <Modal show={showUpdateModal} onHide={() => setShowUpdateModal(false)}>
            <Modal.Header closeButton>
              <Modal.Title>Update Pet</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Form.Group controlId="updatePetName">
                  <Form.Label>Pet Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter pet name"
                    value={updatePetName}
                    onChange={(e) => setUpdatePetName(e.target.value)}
                  />
                </Form.Group>
                <Form.Group controlId="updatePetDOB">
                  <Form.Label>Date of Birth</Form.Label>
                  <Form.Control
                    type="date"
                    value={updatePetDOB}
                    onChange={(e) => setUpdatePetDOB(e.target.value)}
                  />
                </Form.Group>
                <Form.Group controlId="updateSelectSpecies">
                  <Form.Label>Select Species</Form.Label>
                  <Form.Control
                    as="select"
                    value={selectedSpeciesID}
                    onChange={(e) => setSelectedSpeciesID(e.target.value)}
                  >
                    <option value="">Select Species</option>
                    {Array.isArray(species) && species.map(spec => (
                      <option key={spec.SpeciesID} value={spec.SpeciesID}>
                        {spec.SpeciesName}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>
                <Form.Group controlId="updateSelectBreed">
                  <Form.Label>Select Breed</Form.Label>
                  <Form.Control
                    as="select"
                    value={selectedBreedID}
                    onChange={(e) => setSelectedBreedID(e.target.value)}
                    disabled={!breeds.length}  // Disable if no species selected
                  >
                    <option value="">Select Breed</option>
                    {Array.isArray(breeds) && breeds.map(breed => (
                      <option key={breed.BreedID} value={breed.BreedID}>
                        {breed.BreedName}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowUpdateModal(false)}>
                Close
              </Button>
              <Button variant="primary" onClick={updatePet}>
                Save Changes
              </Button>
            </Modal.Footer>
          </Modal>

        </Row>
      </Container>
    </>
  );
}

