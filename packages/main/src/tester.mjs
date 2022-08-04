import { getForgeVersionList } from "@xmcl/installer";

const list = await getForgeVersionList({mcversion: "1.8.9"});

console.log(list.versions[0]);