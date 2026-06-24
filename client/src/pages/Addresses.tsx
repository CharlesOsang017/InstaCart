import { useEffect, useState } from "react";
import type { Address } from "../types";
import Loading from "../components/Loading";
import { MapPin, Plus } from "lucide-react";
import AddressCard from "../components/AddressCard";
import AddressForm from "../components/AddressForm";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import api from "../config/api";

const Addresses = () => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    label: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    isDefault: false,
  });

  const resetForm = () => {
    setForm({
      label: "",
      address: "",
      city: "",
      state: "",
      zip: "",
      isDefault: false,
    });
    setShowForm(false);
    setEditingId(null);
  };

  const {updateUser} = useAuth()

  const getLocation = (retries = 3): Promise<{lat: number; lng: number}>=>{
    return new Promise((resolve, reject)=>{
      if(!navigator.geolocation){
        reject(new Error("Geolocation not supported"))
        return;
      }
      const attempt = ()=>{
        navigator.geolocation.getCurrentPosition(
          (position)=>{
            resolve({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            })
          },
          (error: any)=>{
            if(retries > 0){
              retries--;
              setTimeout(attempt, 1000)
            }else{
              reject(error)
            }
          },
          {
            enableHighAccuracy: false,
            timeout: 15000,
            maximumAge: 600000
          }
        )
      }
      attempt()
    })
  }

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    try {
      const coords = await getLocation()
      const payload = {...form, ...coords}
      if(editingId){
        const {data} = await api.put(`/addresses/${editingId}`, payload);
        setAddresses(data.addresses)
        updateUser({addresses: data.addresses})
        toast.success("Address updated successfully!")
      }else{
        const {data} = await api.post("/addresses", payload);
        setAddresses(data.addresses)
        updateUser({addresses: data.addresses})
        toast.success("Address added successfully!")
      }
      resetForm()
    } catch (error: any) {
      console.log(error)
      toast.error(error.response?.data?.message || error.message)
    }
  };
  const onEditHandler = (addr: Address) => {
    setForm({
      label: addr.label,
      address: addr.address,
      city: addr.city,
      state: addr.state,
      zip: addr.zip,
      isDefault: addr.isDefault,
    });
    setEditingId(addr.id);
    setShowForm(true);
  };
  useEffect(() => {
    api.get('/addresses').then(({data})=>{
      setAddresses(data.addresses)
    }).catch((error)=>{
      toast.error(error.response?.data?.message || error.message)
    }).finally(()=>{
      setLoading(false)
    })
    
  }, []);

  return (
    <div className="min-h-screen bg-app-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-semibold text-app-green">
            My Addresses
          </h1>
          <button
            onClick={() => {
              (resetForm(), setShowForm(true));
            }}
            className="px-4 py-2 bg-app-green text-white text-sm font-semibold rounded-xl hover:bg-app-green-light transition-colors flex items-center gap-2"
          >
            <Plus className="size-4" />
            Add New Address
          </button>
        </div>
        {/* Form Label */}
        {showForm && (
          <AddressForm
            resetForm={resetForm}
            handleSubmit={handleSubmit}
            form={form}
            setForm={setForm}
            editingId={editingId}
          />
        )}

        {/* Address List */}
        {loading ? (
          <Loading />
        ) : addresses.length === 0 ? (
          <div className="text-center py-16">
            <MapPin className="size-16 text-app-border mx-auto mb-4" />
            <h2 className="text-lg font-semibold text-app-green mb-2">
              No addresses saved
            </h2>
            <p className="text-sm text-app-text-light">
              Add an address for faster checkout
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {addresses.map((add) => (
              <AddressCard
                key={add.id}
                addr={add}
                onEditHandler={onEditHandler}
                setAddresses={setAddresses}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Addresses;
