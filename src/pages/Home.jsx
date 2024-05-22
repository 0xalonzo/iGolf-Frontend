import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Description, Field, Label, Select } from "@headlessui/react";
import { ChevronDownIcon, StarIcon } from "@heroicons/react/20/solid";
import { HeartIcon } from "@heroicons/react/24/outline";
import { HeartIcon as HeartIconSolid } from "@heroicons/react/24/solid";

import Container from "../components/Container";
import Loader from "../components/Loader";
import Error from "../components/Error";

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

export default function Home() {
  const [state, setState] = useState(states[0].value);
  const [courses, setCourses] = useState([]);

  const sortedCourses = sortCourses(courses);

  const filteredCourses = sortedCourses.filter(
    (course) => course.state.toLowerCase().replace(/\s+/g, "-") === state
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const { user, setUser, token } = useAuthStore();

 // console.log(user);

  useEffect(() => {
    setIsLoading(true);
    axios
      .get(`https://igolf-backend.runasp.net/api/courses?state=${state}`)
      .then((response) => {
        setCourses(response.data);
      })
      .catch((error) => {
        setError(error.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [state]);

  function handleAddToFavourite(course) {
    axios
      .post(
        `https://igolf-backend.runasp.net/api/favorites/${user.id}/${course.id}`,
        null,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then(() => {
        const updatedUser = {
          ...user,
          favoriteCourses: [...user.favoriteCourses, course],
        };
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
      })
      .catch((error) => {
        setError(error.message);
      })
      .finally(() => {});
  }

  function handleRemoveFromFavourite(course) {
    axios
      .delete(
        `https://igolf-backend.runasp.net/api/favorites/${user.id}/${course.id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then(() => {
        const updatedUser = {
          ...user,
          favoriteCourses: user.favoriteCourses.filter(
            (c) => c.id !== course.id
          ),
        };
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
      })
      .catch((error) => {
        setError(error.message);
      })
      .finally(() => {});
  }

  return (
    <Container className="py-16 grid grid-cols-1 md:grid-cols-2 gap-12">
      {/* Info */}
      <div className="md:my-24">
        {user.fullname && (
          <div className="mb-8 font-semibold">👋🏻 Welcome, {user.fullname}</div>
        )}
        <h2 className="font-bold text-3xl">
          Welcome to iGolf: Your Gateway to Golfing Adventures
        </h2>
        <p className="text-gray-600 mt-3 leading-relaxed">
          Discover the world of golfing excellence with iGolf! Whether
          you&apos;re an avid golfer or simply curious about the sport, iGolf is
          your ultimate destination to explore premier golf courses across the
          globe. From iconic courses nestled in the heart of California to
          hidden gems scattered throughout New York, iGolf provides you with a
          comprehensive platform to discover, explore, and plan your next
          golfing adventure. Start your journey today and unlock a world of
          endless golfing possibilities
        </p>

        <Field className="mt-16">
          <Label className="font-semibold text-lg">Select State</Label>
          <Description className="text-gray-600 mt-1">
            This will show you all the courses available in that particular
            state.
          </Description>
          <div className="relative">
            <Select
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="shadow-sm focus:ring-green-500 focus:border-green-500 block w-72 sm:text-sm border-gray-300 rounded-md mt-3"
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
      {/* Courses */}
      <div className="w-full bg-gray-100 rounded-lg overflow-y-scroll p-4 md:p-8 flex gap-6 flex-col md:h-[36rem]">
        {isLoading ? (
          <div className="flex justify-center">
            <Loader />
          </div>
        ) : error ? (
          <Error message={error} />
        ) : (
          <>
            <h2 className="font-semibold text-lg -mb-2">
              Here are the courses:
            </h2>
            {filteredCourses.map((course) => (
              <div
                key={course.name}
                className="bg-green-200 p-3 rounded-md flex justify-between items-start"
              >
                <div>
                  <h3 className="font-semibold text-green-800">
                    {course.name}
                  </h3>
                  <p className="text-sm text-green-700">
                    {course.location},{" "}
                    {states.find((s) => s.value === course.state).label}
                  </p>
                  <p className="text-sm mt-2">
                    Designed by:{" "}
                    <span className="font-medium">{course.designer}</span>
                  </p>
                  <div className="flex text-sm mt-1 gap-8">
                    <p>Par: {course.par}</p>
                    <p>Holes: {course.holes}</p>
                    <p className="inline-flex items-center gap-1">
                      Rating: {course.rating} <StarIcon className="h-4 w-4" />
                    </p>
                  </div>
                </div>
                {token && (
                  <div>
                    {user.favoriteCourses.some((c) => c.id === course.id) ? (
                      <Button
                        className="p-2"
                        onClick={() => handleRemoveFromFavourite(course)}
                      >
                        <HeartIconSolid className="h-6 w-6 text-red-600" />
                      </Button>
                    ) : (
                      <Button
                        className="p-2"
                        onClick={() => handleAddToFavourite(course)}
                      >
                        <HeartIcon className="h-6 w-6" />
                      </Button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </>
        )}
      </div>
    </Container>
  );
}

const sortCourses = (courses) => {
  return courses.slice().sort((a, b) => a.name.localeCompare(b.name));
};
