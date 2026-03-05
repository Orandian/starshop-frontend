import u1 from "@/public/fc/u1.png";
import { Crown } from "lucide-react";
import { Fragment } from "react";
import ImageComponent from "../ImageComponent";

interface OrgItem {
  name: string;
  profile: string;
  children?: OrgItem[];
}

interface CardProps {
  data: OrgItem[];
}

const Card = ({ data }: { data: OrgItem[] }) => {
  return (
    <ul>
      {data.map((item) => (
        <Fragment key={item.name}>
          <li>
            <div className="card">
              <div className="image relative">
                <ImageComponent imgURL={item.profile || u1.src} imgName="Profile" />
                <div className="absolute bottom-0 right-0 flex justify-center bg-gray-200 w-20 px-1  rounded-md ">
                  <Crown className="text-orange-500 size-5" />
                </div>
              </div>
              <div className="card-body">
                <p className="text-dark">test</p>
              </div>
            </div>
            {item.children?.length && <Card data={item.children} />}
          </li>
        </Fragment>
      ))}
    </ul>
  );
};

const Chart = ({ data }: CardProps) => {
  return (
    <div className="org-tree">
      <Card data={data} />
    </div>
  );
};

export default Chart;
