import { useState,useEffect } from 'react';
import './App.css';
import axios from 'axios';



const initialValues = {
  id: null,
  name: "",
  surname: "",
  middle_name: "",
  phone_number: "",
}


function MainPage({LogOut}) {
  const [staffData, setStaffData] = useState(initialValues);
  const [count, setCount] = useState(0);
  const [staff, setStaff] = useState([]);
  const [editStaffData, setEditStaffData] = useState({
    isEdit: false,
    staffIndex: null
  })
  const token = window.localStorage.getItem('token');
  const isFilledFields = staffData.name && staffData.surname && staffData.middle_name && staffData.phone_number;
  
  console.log(staffData);

  useEffect(() => {
    const fetchStaff = async () => {
      try{
          const response = await axios.get('http://localhost:8000/api/client/list',{
            headers: {
                Authorization: `Bearer ${token}`
            }
          })
          setStaff(response.data);
      } catch (error){
        console.error("error fetchong staff members: ",error);
      }
    };
    fetchStaff();
  },[])

  const handleSubmit = async (e) =>{
    e.preventDefault();
    if (isFilledFields){
      if(editStaffData.isEdit){
        staffData.phone_number = Number(staffData.phone_number);
        try{
            const response = await axios.put(`http://localhost:8000/api/client/${staffData.id}`,{
              headers: {
                    Authorization: `Bearer ${token}`
              },
              name: staffData.name,
              surname: staffData.surname,
              middle_name: staffData.middle_name,
              phone_number: staffData.phone_number
            });
            if(response.status === 200){
              const editData = staff;
              editData.splice(editStaffData.staffIndex, 1,staffData);
              setStaffData(editData);
              setEditStaffData({
                isEdit: false,
                staffIndex: null
             });
              setStaffData(initialValues);
            } else{
              console.error('Editing client failure');
            }
        } catch(error){
          console.error('Error editing client: ',error);
        }
      }
      else{
        staffData.phone_number = Number(staffData.phone_number);
        try {
          const response = await axios.post('http://localhost:8000/api/client/', {
            headers: {
                Authorization: `Bearer ${token}`
            },
            name: staffData.name,
            surname: staffData.surname,
            middle_name: staffData.middle_name,
            phone_number: staffData.phone_number
          });
          if(response.status === 200){
            staffData.id = response.data.id;
            setStaff((prevState) => [...prevState, staffData]);
            setStaffData(initialValues);
          } else{
            console.error('Add request failure');
          }
          
        }catch (error){
          console.error('error adding client: ',error);
        }
        
      }
    }
  };

  const hadleRefresh = (e) =>{
    setStaffData(initialValues);
    setEditStaffData({
      isEdit: false,
      staffIndex: null 
    })
  };


  const handleLogOut = () =>{
    window.localStorage.setItem('token', '');
    LogOut();
  }

  const handleRemoveClick = async (index) => {
    const id = staff[index].id;
    try{
      const response = await axios.delete(`http://localhost:8000/api/client/${id}`);
      if(response.status === 200){
        setStaff(staff.filter((staff_member, staff_index) => staff_index !== index));
      } else{
        console.error('deleting client failure');
      }
    } catch (error){
      console.error('error deleting client: ',error);   
    }
  } 
  

  const handleEditClick = (data, index) => {
    setStaffData(data);
    setEditStaffData({
      isEdit: true,
      staffIndex: index
    })
  };
  
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
                  <td>{staff.phone_number}</td>
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
        <form onSubmit={handleSubmit} onReset={hadleRefresh}>
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
            phone_number:e.target.value
          }))}
          value={staffData.phone_number}/>
          <div className='buttons_wrapper'>
            <button type="reset">Clean</button>
            <button disabled ={!isFilledFields}type="submit">Add</button>
          </div>
        </form>
      </div>
      <button onClick={handleLogOut}>Выйти</button>
    </div>
  );
}

export default MainPage;
