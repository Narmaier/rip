import { useState } from 'react';
import './App.css';




const initialValues = {
  name: "",
  surname: "",
  middle_name: "",
  number: "",
}


function App() {
  const [staffData, setStaffData] = useState(initialValues);
  const [count, setCount] = useState(0);
  const [staff, setStaff] = useState([]);
  const [editStaffData, setEditStaffData] = useState({
    isEdit: false,
    staffIndex: null
  })
  const isFilledFields = staffData.name && staffData.surname && staffData.middle_name && staffData.number;
  
  const handleSubmit = (e) =>{
    e.preventDefault();
    if (isFilledFields){
      if(editStaffData.isEdit){
        const editData = staff;
        editData.splice(editStaffData.staffIndex, 1,staffData);
        setStaffData(editData);
        setEditStaffData({
          isEdit: false,
          staffIndex: null
        })
        setStaffData(initialValues);
      }
      else{
        setStaff((prevState) => [...prevState, staffData]);
        setStaffData(initialValues);
      }
      }
    };

  const hadleRefresh = (e) =>{
  };

  const handleRemoveClick = (index) => {
    setStaff(staff.filter((staff_member, staff_index) => staff_index !== index));
  }; 

  const handleEditClick = (data, index) => {
    setStaffData(data);
    setEditStaffData({
      isEdit: true,
      staffIndex: index
    })
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/Staff/');
        const data = await response.json();
        setStaff(data);
      } catch (error) {
        console.error('Error fetching data', error);
      }
    };

    fetchData();
  }, []);

  

  return (
    <div className='wrapper'>
      <div className='content_wrapper'>
        <div className='table_wrapper'>
          <table>
            <th>#</th>
            <th>Имя</th>
            <th>Фамилия</th>
            <th>Отчество</th>
            <th>Номер</th>
            <th> </th>
            <tbody>
              {staff.map((staff, index) => (
                <tr>
                  <td>{index+1}</td>
                  <td>{staff.name}</td>
                  <td>{staff.surname}</td>
                  <td>{staff.middle_name}</td>
                  <td>{staff.number}</td>
                  <td>
                    <div className='entry_buttons_wrapper'>
                      <button onClick={() => handleEditClick(staff,index)}>edit</button>
                      <button onClick={() => handleRemoveClick(index)}>remove</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

        </div>
        <form onSubmit={handleSubmit}>
          <input placeholder = "Имя" onChange={(e) => setStaffData((prevState) => ({
          ...prevState,
          name:e.target.value
          }))}
          value={staffData.name}/>
          <input placeholder = "Фамилия" onChange={(e) => setStaffData((prevState) => ({
            ...prevState,
            surname:e.target.value
          }))}
          value={staffData.surname}/>
          <input placeholder = "Отчество" onChange={(e) => setStaffData((prevState) => ({
            ...prevState,
            middle_name:e.target.value
          }))}
          value={staffData.middle_name}/>
          <input placeholder = "Номер" onChange={(e) => setStaffData((prevState) => ({
            ...prevState,
            number:e.target.value
          }))}
          value={staffData.number}/>
          <div className='buttons_wrapper'>
            <button type="reset">Clean</button>
            <button disabled ={!isFilledFields}type="submit">Add</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default App;
