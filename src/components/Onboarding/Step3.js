import { Card } from "../ui/Card";
import Spinner from "../ui/Spinner";
import { useState } from "react";

export function Step3({ setTags }) {
  const [data, setData] = useState([
    "Technology",
    "Politics",
    "Sports",
    "Movies",
    "Music",
    "Books",
    "Food",
    "Travel",
    "Fashion",
    "Gaming",
    "Art",
    "Science",
    "Health",
    "Education",
    "Business",
    "Finance",
    "Entertainment",
    "Lifestyle",
    "News",
    "Weather",
  ]);
  const [hashtags, setHashtags] = useState([]);
  const [loading, setLoading] = useState(false);

  if (!data || loading)
    return (
      <Card rounded="lg" shadow="lg" className="py-10 mt-6">
        <Spinner />
      </Card>
    );

  const handleChange = (data, index) => {
    const newHashtag = "#" + data.toString().toLowerCase();
    if (hashtags.includes(newHashtag)) {
      setHashtags(hashtags.filter((item) => item !== newHashtag));
      setTags(hashtags.filter((item) => item !== newHashtag));
    } else {
      setHashtags([...hashtags, newHashtag]);
      setTags([...hashtags, newHashtag]);
    }
  };
  return (
    <div className="space-y-4 my-6">
      <Card rounded="lg" shadow="lg">
        <Card.Body>
          <div className="text-2xl font-bold">Your Interests</div>
          <div className="text-gray-500">
            Select the topics you are interested in to get posts according to
            your needs (Min of 3 topics)
          </div>
        </Card.Body>

        <Card.Body className="max-h-96 overflow-y-scroll">
          <ul role="list" className=" divide-y">
            {data.map((edge, index) => {
              return (
                <li
                  key={index}
                  className="py-4 px-5 hover:bg-gray-100 dark:hover:bg-gray-900 hover:rounded-lg"
                >
                  <div className="flex items-end ">
                    <div className="flex-initial grow">
                      <h1>{edge}</h1>
                    </div>
                    <div className="flex-initial">
                      <input
                        type="checkbox"
                        onChange={(e) => {
                          handleChange(edge, index);
                        }}
                      />
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </Card.Body>
      </Card>
    </div>
  );
}
