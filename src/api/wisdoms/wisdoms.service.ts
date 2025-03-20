import { Injectable } from '@nestjs/common';
import { WisdomRequestParams, WisdomsRequestParams } from './entities/wisdoms.request';
import { WisdomResponse, WisdomsResponse } from './entities/wisdoms.response';
import { wisdoms, wisdomParts } from '@const';

@Injectable()
export class WisdomsService {
  getRandomN(l: number) {
    return Math.floor(Math.random() * Math.floor(l)) + 1;
  }

  randomWisdom = (wisdomList: string[]) => {
    const first = wisdomList[this.getRandomN(wisdomList.length)];
    const second = wisdomList[this.getRandomN(wisdomList.length)];
    const third = wisdomList[this.getRandomN(wisdomList.length)];
    const final =
      `${first}, ${second}${this.getRandomN(2) === 2 ? `, ${third}` : ''}`
        .trim()
        .toLowerCase()
        .replace(/\.|!/g, '')
        .replace(/\s{2,}/g, ' ') + '.';

    return final[0]!.toUpperCase() + final.slice(1);
  };

  async getWisdom(params: WisdomRequestParams): Promise<WisdomResponse> {
    const localWisdoms = wisdomParts[params.lang];
    const randomWisdom = this.randomWisdom(localWisdoms);

    return Promise.resolve({
      wisdom: randomWisdom,
    });
  }

  async getWisdoms(params: WisdomsRequestParams): Promise<WisdomsResponse> {
    const { offset, limit, lang } = params;
    const localWisdoms = wisdoms[lang];
    const total = localWisdoms.length;

    const endIndex = Math.min(offset + limit, total);
    const remaining = Math.max(0, total - endIndex);
    const currentPageWisdoms = localWisdoms.slice(offset, endIndex);
    const previousOffset = Math.max(0, offset - limit);
    const nextOffset = endIndex < total ? endIndex : null;
    const previous = offset > 0 ? `/api/wisdoms?lang=${lang}&offset=${previousOffset}&limit=${limit}` : null;
    const next = nextOffset !== null ? `/api/wisdoms?lang=${lang}&offset=${nextOffset}&limit=${limit}` : null;

    return Promise.resolve({
      pagination: {
        offset,
        limit,
        total,
        remaining,
        previous,
        next,
      },
      wisdoms: currentPageWisdoms,
    });
  }
}
