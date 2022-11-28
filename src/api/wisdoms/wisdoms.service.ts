import { Injectable } from "@nestjs/common";
import { WisdomsRequest } from "./entities/wisdoms.request";
import { WisdomResponse, WisdomsResponse } from "./entities/wisdoms.response";
import { wisdoms, wisdomParts } from "@const";

// import { DefaultConfig } from "@const";
// import { ConfigService } from "@nestjs/config";

@Injectable()
export class WisdomsService {

    // constructor(
    //     private config: ConfigService<DefaultConfig, true>
    // ) { }

    getRandomN(l: number) {
        return Math.floor(Math.random() * Math.floor(l)) + 1;
    }

    randomWisdom = (wisdomList: string[]) => {
        const first = wisdomList[this.getRandomN(wisdomList.length)];
        const second = wisdomList[this.getRandomN(wisdomList.length)];
        const third = wisdomList[this.getRandomN(wisdomList.length)];
        const final = `${first}, ${second}${this.getRandomN(2) === 2 ? `, ${third}` : ""}`.trim().toLowerCase().replace(/\.|!/g, "").replace(/\s{2,}/g, " ") + ".";

        return final[0].toUpperCase() + final.slice(1);
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async getWisdom(req: WisdomsRequest, _origin: string): Promise<WisdomResponse> {
        const localWisdoms = wisdomParts[req.lang || "en"];
        const randomWisdom = this.randomWisdom(localWisdoms);

        return Promise.resolve({
            wisdom: randomWisdom || "Lying down you can't eat an apple, help yourself and god help you, mind to the ankles."
        });
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async getWisdoms(req: WisdomsRequest, _origin: string): Promise<WisdomsResponse> {
        const localWisdoms = wisdoms[req.lang || "en"];

        return Promise.resolve({
            wisdoms: localWisdoms
        });
    }

}
