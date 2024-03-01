async function generateSHA256Hash(inputString) {
    const stringBytes = (new TextEncoder).encode(inputString);
    const hashBuffer = await crypto.subtle.digest("SHA-256", stringBytes);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashString = hashArray.map(byte => byte.toString(16).padStart(2, "0")).join("");
    return hashString;
}

// generates random strings and hashes them until the hash starts with a specific prefix
async function generateHashPairWithPrefix(challengeId, prefix) {
    while (true) {
        const randomString = Math.random().toString(36).substring(2, 15)
        const hash = await generateSHA256Hash(challengeId + randomString);

        if (hash.startsWith(prefix)) {
            return { key: randomString, hash: hash }
        }
    }
}

export async function solveChallenge(challengeToken) {
    const decodedChallengeToken = atob(challengeToken.split(".")[3])

    let [_, challengeId, hashPrefix, count] = decodedChallengeToken.split(";")

    const solutionKeys = [];
    for (let i = 0; i < Number(count); i++) {
        const solutionHashPair = await generateHashPairWithPrefix(challengeId, hashPrefix);

        solutionKeys.push(solutionHashPair.key), hashPrefix = solutionHashPair.hash.slice(-hashPrefix.length);
    }
    return solutionKeys.join(";");
}
