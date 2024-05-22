import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Input, Button, Field, Label, Select } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";

import Container from "../components/Container";
import Loader from "../components/Loader";

import useAuthStore from "../hooks/useAuthStore";

const states = [
  { label: "California", value: "california" },
  { label: "New York", value: "new-york" },
  { label: "Georgia", value: "georgia" },
  { label: "North Carolina", value: "north-carolina" },
  { label: "Wisconsin", value: "wisconsin" },
  { label: "South Carolina", value: "south-carolina" },
  { label: "Northern Ireland", value: "northern-ireland" },
  { label: "Scotland", value: "scotland" },
  { label: "Pennsylvania", value: "pennsylvania" },
  { label: "Ohio", value: "ohio" },
];

export default function AddCourse() {
  const initialFormData = {
    name: "",
    location: "",
    state: states.at(0).value,
    holes: "",
    par: "",
    designer: "",
    rating: "",
  };

  const [formData, setFormData] = useState(initialFormData);

  const [error, setError] = useState(null);
  const notify = () => toast.success("Course added successfully!");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { token } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/");
    }
  }, [token, navigate]);

  function handleSubmit(e) {
    e.preventDefault();
    setIsSubmitting(true);
    axios
      .post(`https://igolf-backend.runasp.net/api/courses`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        notify();
        setFormData(initialFormData);
      })
      .catch((error) => {
        setError(error.message);
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]:
        name === "holes" || name === "par"
          ? parseInt(value)
          : name === "rating"
          ? parseFloat(value)
          : value,
    }));
  }

  return (
    <Container className="py-16">
      <div className="max-w-md mx-auto">
        <h1 className="text-center font-bold text-2xl">
          Add a new golf course
        </h1>

        <form className="mt-10 flex flex-col gap-4" onSubmit={handleSubmit}>
          <Field>
            <Label className="block text-sm font-medium text-gray-700">
              Name
            </Label>
            <Input
              className="shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md mt-2"
              name="name"
              placeholder="Pebble Beach Golf Links"
              value={formData.name}
              onChange={handleChange}
              required
              maxLength={50}
            />
          </Field>

          <div className="flex gap-6">
            <Field className="w-full">
              <Label className="block text-sm font-medium text-gray-700">
                Location
              </Label>
              <Input
                className="shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md mt-2"
                name="location"
                placeholder="Monterey County"
                value={formData.location}
                onChange={handleChange}
                required
                maxLength={26}
              />
            </Field>

            <Field className="w-full">
              <Label className="block text-sm font-medium text-gray-700">
                Select State
              </Label>
              <div className="relative">
                <Select
                  value={formData.state}
                  name="state"
                  onChange={handleChange}
                  className="shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md mt-2"
                >
                  {states.map((state, index) => (
                    <option key={index} value={state.value}>
                      {state.label}
                    </option>
                  ))}
                </Select>
                <ChevronDownIcon
                  className="group pointer-events-none absolute top-2.5 right-2.5 size-4 fill-white/60"
                  aria-hidden="true"
                />
              </div>
            </Field>
          </div>

          <Field>
            <Label className="block text-sm font-medium text-gray-700">
              Designer
            </Label>
            <Input
              className="shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md mt-2"
              name="designer"
              placeholder="Jack Neville & Douglas Grant"
              value={formData.designer}
              onChange={handleChange}
              required
              maxLength={50}
            />
          </Field>

          <div className="flex gap-6">
            <Field className="w-full">
              <Label className="block text-sm font-medium text-gray-700">
                Holes
              </Label>
              <Input
                type="number"
                className="shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md mt-2"
                name="holes"
                placeholder="18"
                value={formData.holes}
                onChange={handleChange}
                required
                min={1}
                max={100}
              />
            </Field>
            <Field className="w-full">
              <Label className="block text-sm font-medium text-gray-700">
                Par
              </Label>
              <Input
                type="number"
                className="shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md mt-2"
                name="par"
                placeholder="72"
                value={formData.par}
                onChange={handleChange}
                required
                min={1}
                max={100}
              />
            </Field>
            <Field className="w-full">
              <Label className="block text-sm font-medium text-gray-700">
                Rating
              </Label>
              <Input
                type="number"
                step="0.1"
                className="shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md mt-2"
                name="rating"
                placeholder="4.5"
                value={formData.rating}
                onChange={handleChange}
                required
                min={1}
                max={5}
              />
            </Field>
          </div>

          <div className="mt-5 text-center">
            <Button
              className="inline-flex items-center w-full justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-60 disabled:cursor-not-allowed"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="inline-flex gap-3 items-center">
                  Submitting <Loader h={5} w={5} />
                </div>
              ) : (
                "Submit"
              )}
            </Button>
          </div>
        </form>

        {error && (
          <div className="text-red-600 text-center mt-6 p-2 bg-red-100 rounded-sm ring-1 ring-red-300">
            {error}
          </div>
        )}
      </div>
    </Container>
  );
}
