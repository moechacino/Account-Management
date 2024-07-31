
export default function getData(){
    const data = []
    for (let i = 1; i <= 10 ; i++) {
        data.push({
            id: i,
            title: `Title ${i}`,
            credential: `${i}@gmail.com`,
            password: `iniPassword${i}`,
            type: `Mobile Legends`,
            usability : `akun gb 100`,
            note: `ini bukan akun biasa , password ngeri`
        })
    }
    return data
}
