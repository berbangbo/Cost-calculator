const M = document.getElementById('materials');

const money = n =>
  '฿' + Number(n || 0).toLocaleString('th-TH',{
    minimumFractionDigits:2,
    maximumFractionDigits:2
  });


// =========================
// MATERIAL
// =========================

function addMaterial(){

  const el = document.createElement('div');

  el.className = 'material';

  el.innerHTML = `
    <div class="grid">

      <label>
        วัสดุ
        <input class="name" placeholder="เช่น เหล็กกล่อง 1x1">
      </label>

      <label>
        วิธีคิด
        <select class="type">

          <option value="piece">
            ต่อชิ้น / หน่วย
          </option>

          <option value="length">
            ต่อเมตร
          </option>

          <option value="area">
            ตามพื้นที่
          </option>

        </select>
      </label>

      <label>
        ราคาซื้อ
        <input class="price" type="number" min="0" placeholder="บาท">
      </label>

    </div>

    <div class="grid3">

      <label class="size1-label">
        ความยาวที่ซื้อ (ม.)
        <input class="s1" type="number" min="0">
      </label>

      <label class="size2-label">
        ยาวที่ซื้อ (ซม.)
        <input class="s2" type="number" min="0">
      </label>

      <label>
        ใช้ไป
        <input class="qty" type="number" min="0" step="0.01" placeholder="จำนวน">
      </label>

    </div>

    <div class="costline">
      <span>ต้นทุนรายการนี้</span>
      <span class="cost">฿0.00</span>
    </div>

    <div style="text-align:right">
      <button type="button" class="del">
        ลบวัสดุ
      </button>
    </div>
  `;

  M.appendChild(el);


  el.querySelectorAll('input,select')
    .forEach(x => x.addEventListener('input',calc));


  el.querySelector('.del')
    .addEventListener('click',()=>{
      el.remove();
      calc();
    });


  el.querySelector('.type')
    .addEventListener('change',()=>{
      updateLabels(el);
      calc();
    });


  updateLabels(el);
}


// =========================
// LABEL
// =========================

function updateLabels(el){

  const t = el.querySelector('.type').value;

  const l1 = el.querySelector('.size1-label');
  const l2 = el.querySelector('.size2-label');


  if(t === 'length'){

    l1.firstChild.textContent =
      'ความยาวที่ซื้อ (ม.)';

    l2.style.display = 'none';

  }

  else if(t === 'area'){

    l1.firstChild.textContent =
      'กว้างที่ซื้อ (ซม.)';

    l2.firstChild.textContent =
      'ยาวที่ซื้อ (ซม.)';

    l2.style.display = 'block';

  }

  else{

    l1.firstChild.textContent =
      'ขนาดอ้างอิง (ถ้ามี)';

    l2.style.display = 'none';

  }

}


// =========================
// CALCULATE
// =========================

function calc(){

  let mat = 0;


  M.querySelectorAll('.material').forEach(el=>{

    const p =
      +el.querySelector('.price').value || 0;

    const q =
      +el.querySelector('.qty').value || 0;

    const t =
      el.querySelector('.type').value;

    const s1 =
      +el.querySelector('.s1').value || 0;

    const s2 =
      +el.querySelector('.s2').value || 0;


    let c = 0;


    if(t === 'piece')
      c = p * q;


    if(t === 'length')
      c = s1 > 0 ? p * (q / s1) : 0;


    if(t === 'area')
      c =
        (s1 > 0 && s2 > 0)
        ? p * (q / (s1 * s2))
        : 0;


    el.querySelector('.cost').textContent =
      money(c);


    mat += c;

  });


  const lab =
    +document.getElementById('labor').value || 0;

  const sell =
    +document.getElementById('selling').value || 0;


  document.getElementById('mat').textContent =
    money(mat);

  document.getElementById('lab').textContent =
    money(lab);

  document.getElementById('total').textContent =
    money(mat + lab);

  document.getElementById('profit').textContent =
    money(sell - mat - lab);

}


// =========================
// IMAGE
// =========================

let jobImageData = '';


document.getElementById('jobImage')
  .addEventListener('change', function(){

    const file = this.files[0];

    if(!file) return;


    const reader = new FileReader();


    reader.onload = function(e){

      jobImageData = e.target.result;


      const preview =
        document.getElementById('imagePreview');


      preview.innerHTML =
        `<img src="${jobImageData}" alt="รูปงาน">`;


      preview.style.display = 'block';

    };


    reader.readAsDataURL(file);

  });


// =========================
// ADD MATERIAL
// =========================

document.getElementById('add')
  .addEventListener('click',addMaterial);


document.getElementById('labor')
  .addEventListener('input',calc);


document.getElementById('selling')
  .addEventListener('input',calc);


document.getElementById('difficulty')
  .addEventListener('change',e=>{

    const base =
      [0,100,200,300,400,500];

    document.getElementById('labor').value =
      base[+e.target.value];

    calc();

  });
// =========================
// DETAIL BOXES
// =========================

const detailBoxes =
  document.getElementById('detailBoxes');

const addDetailBtn =
  document.getElementById('addDetail');


// จำกัดความสูงของข้อความแต่ละหน้า
// ถ้าเกิน จะไม่ยอมให้พิมพ์ตัวใหม่เพิ่ม
function limitDetailText(textarea){

  const oldValue = textarea.value;

  // ปล่อยให้ browser คำนวณก่อน
  requestAnimationFrame(() => {

    if(
      textarea.scrollHeight >
      textarea.clientHeight
    ){

      let value =
        textarea.value;

      // ตัดตัวท้ายออกทีละตัว
      while(
        textarea.scrollHeight >
        textarea.clientHeight &&
        value.length > 0
      ){

        value =
          value.slice(0,-1);

        textarea.value =
          value;

        // บังคับให้ browser คำนวณใหม่
        textarea.style.height =
          textarea.style.height;

      }

    }

    updateDetailCount(textarea);

  });

}


// นับจำนวนตัวอักษร
function updateDetailCount(textarea){

  const box =
    textarea.closest('.detail-box');

  if(!box) return;

  const count =
    box.querySelector('.detail-count');

  count.textContent =
    `${textarea.value.length} ตัวอักษร`;

}


// เพิ่มกล่องรายละเอียด
function addDetailBox(initialText=''){

  const number =
    detailBoxes.querySelectorAll(
      '.detail-box'
    ).length + 1;


  const box =
    document.createElement('div');

  box.className =
    'detail-box';


  box.innerHTML = `

    <div class="detail-box-head">

      <div class="detail-box-title">
        รายละเอียดหน้า ${number}
      </div>

      <button
        type="button"
        class="detail-delete"
      >
        ลบหน้า
      </button>

    </div>


    <textarea
      class="detail-text"
      rows="20"
      placeholder="ใส่รายละเอียดงาน..."
    ></textarea>


    <div class="detail-count">
      0 ตัวอักษร
    </div>

  `;


  const textarea =
    box.querySelector('.detail-text');


  textarea.value =
    initialText;


  textarea.addEventListener(
    'input',
    () => {

      limitDetailText(textarea);

    }
  );


  box.querySelector('.detail-delete')
    .addEventListener(
      'click',
      () => {

        box.remove();

        renumberDetailBoxes();

      }
    );


  detailBoxes.appendChild(box);

  updateDetailCount(textarea);

}


// เรียงเลขหน้าใหม่
function renumberDetailBoxes(){

  detailBoxes
    .querySelectorAll('.detail-box')
    .forEach((box,index)=>{

      box.querySelector(
        '.detail-box-title'
      ).textContent =
        `รายละเอียดหน้า ${index + 1}`;

    });

}


// ปุ่มเพิ่มหน้า
addDetailBtn.addEventListener(
  'click',
  () => {

    addDetailBox();

  }
);


// เริ่มต้น 1 หน้า
addDetailBox();

// =========================
// PDF EXPORT
// =========================

const pdfBtn = document.createElement('button');

pdfBtn.type = 'button';
pdfBtn.textContent = '📄 บันทึกเป็น PDF';
pdfBtn.style.marginTop = '10px';

document.body.appendChild(pdfBtn);


// =========================
// ESCAPE HTML
// =========================

function escapeHTML(text){
  return String(text)
    .replace(/&/g,'&amp;')
    .replace(/</g,'&lt;')
    .replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;')
    .replace(/'/g,'&#039;');
}


// =========================
// CREATE PDF PAGE
// =========================

async function createPDFPage(pdf, content){

  const page = document.createElement('div');

  page.style.position = 'fixed';
  page.style.left = '-10000px';
  page.style.top = '0';

  // A4 ประมาณ 96 DPI
  page.style.width = '794px';
  page.style.height = '1123px';

  page.style.background = '#ffffff';
  page.style.color = '#202124';

  page.style.padding = '42px';

  page.style.fontFamily =
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Arial,sans-serif';

  page.style.fontSize = '15px';
  page.style.lineHeight = '1.5';

  page.style.overflow = 'hidden';

  page.innerHTML = content;

  document.body.appendChild(page);


  // รอรูป
  const images = page.querySelectorAll('img');

  await Promise.all(
    [...images].map(img => {

      if(img.complete){
        return Promise.resolve();
      }

      return new Promise(resolve => {
        img.onload = resolve;
        img.onerror = resolve;
      });

    })
  );


  const canvas = await html2canvas(page,{
    scale:2,
    useCORS:true,
    backgroundColor:'#ffffff',
    width:794,
    height:1123,
    windowWidth:794
  });


  const imgData =
    canvas.toDataURL('image/jpeg',0.95);


  if(pdf.getNumberOfPages() > 0){
    pdf.addPage();
  }


  pdf.addImage(
    imgData,
    'JPEG',
    10,
    10,
    190,
    277
  );


  page.remove();
}


// =========================
// PDF BUTTON
// =========================

pdfBtn.addEventListener('click', async () => {

  if(!window.html2canvas || !window.jspdf){

    alert(
      'ระบบ PDF ยังโหลดไม่เสร็จ กรุณาลองใหม่อีกครั้ง'
    );

    return;
  }


  const { jsPDF } = window.jspdf;


  // =========================
  // ข้อมูลหลัก
  // =========================

  const jobName =
    document.getElementById('jobName')
      .value
      .trim() || 'ไม่มีชื่อชิ้นงาน';


  const detailPages = [];

detailBoxes
  .querySelectorAll('.detail-text')
  .forEach(textarea => {

    const text =
      textarea.value.trim();

    if(text){
      detailPages.push(text);
    }

  });


  const date =
    new Date().toLocaleDateString(
      'th-TH',
      {
        day:'2-digit',
        month:'2-digit',
        year:'numeric'
      }
    );


  const selling =
    +document.getElementById('selling').value || 0;


  const mat =
    document.getElementById('mat').textContent;


  const lab =
    document.getElementById('lab').textContent;


  const total =
    document.getElementById('total').textContent;


  const profit =
    document.getElementById('profit').textContent;


  // =========================
  // วัสดุ
  // =========================

  const materials = [];


  M.querySelectorAll('.material')
    .forEach(el => {

      const name =
        el.querySelector('.name')
          .value || '-';


      const type =
        el.querySelector('.type').value;


      const qty =
        +el.querySelector('.qty').value || 0;


      let typeText =
        'ต่อชิ้น / หน่วย';


      let useText =
        qty;


      if(type === 'length'){

        typeText = 'ต่อเมตร';

        useText =
          qty.toLocaleString('th-TH') + ' ม.';

      }


      if(type === 'area'){

        typeText = 'ตามพื้นที่';

        useText =
          qty.toLocaleString('th-TH') + ' ตร.ซม.';

      }


      materials.push({

        name,
        typeText,
        useText,

        cost:
          el.querySelector('.cost')
            .textContent

      });

    });


  // =========================
  // PDF
  // =========================

  const pdf =
    new jsPDF({

      orientation:'portrait',

      unit:'mm',

      format:'a4',

      compress:true

    });


  // ==================================================
  // PAGE 1
  // ภาพรวมงาน
  // ==================================================

  let imageHTML = '';


  if(jobImageData){

    imageHTML = `
      <img
        src="${jobImageData}"
        style="
          width:100%;
          height:360px;
          object-fit:contain;
          border-radius:18px;
          border:1px solid #ddd;
          background:#f5f5f5;
        "
      >
    `;

  }else{

    imageHTML = `
      <div style="
        width:100%;
        height:360px;
        border:2px dashed #ccc;
        border-radius:18px;
        display:flex;
        align-items:center;
        justify-content:center;
        color:#999;
        font-size:18px;
      ">
        ไม่มีรูปงาน
      </div>
    `;

  }


  await createPDFPage(pdf,`

    <div style="
      border-bottom:4px solid #202124;
      padding-bottom:16px;
      margin-bottom:28px;
    ">

      <div style="
        font-size:30px;
        font-weight:800;
      ">
        🔧 Cost Calculator
      </div>

      <div style="
        color:#777;
        font-size:15px;
      ">
        สรุปต้นทุนงานช่าง
      </div>

    </div>


    <div style="
      display:flex;
      justify-content:space-between;
      margin-bottom:24px;
    ">

      <div>

        <div style="
          color:#777;
          font-size:14px;
        ">
          ชื่องาน
        </div>

        <div style="
          font-size:30px;
          font-weight:800;
        ">
          ${escapeHTML(jobName)}
        </div>

      </div>


      <div style="
        text-align:right;
        color:#666;
      ">

        วันที่<br>

        <strong>
          ${date}
        </strong>

      </div>

    </div>


    <!-- รูปงาน -->

    <div style="
      margin-bottom:28px;
    ">

      ${imageHTML}

    </div>


    <!-- สรุปราคา -->

    <div style="
      display:grid;
      grid-template-columns:1fr 1fr;
      gap:16px;
    ">


      <div style="
        border:1px solid #ddd;
        border-radius:16px;
        padding:20px;
      ">

        <div style="
          color:#777;
          font-size:14px;
        ">
          ต้นทุนรวม
        </div>

        <div style="
          font-size:28px;
          font-weight:800;
          margin-top:6px;
        ">
          ${total}
        </div>

      </div>


      <div style="
        border:1px solid #ddd;
        border-radius:16px;
        padding:20px;
      ">

        <div style="
          color:#777;
          font-size:14px;
        ">
          ราคาขาย
        </div>

        <div style="
          font-size:28px;
          font-weight:800;
          margin-top:6px;
        ">
          ${money(selling)}
        </div>

      </div>


      <div style="
        grid-column:1/-1;
        background:#202124;
        color:#fff;
        border-radius:16px;
        padding:22px;
        display:flex;
        justify-content:space-between;
        align-items:center;
      ">

        <div style="
          font-size:22px;
          font-weight:700;
        ">
          กำไร
        </div>

        <div style="
          font-size:30px;
          font-weight:800;
        ">
          ${profit}
        </div>

      </div>


    </div>


    <div style="
      position:absolute;
      bottom:35px;
      left:42px;
      right:42px;
      border-top:1px solid #ddd;
      padding-top:8px;
      color:#999;
      font-size:11px;
    ">
      Cost Calculator • บันทึกต้นทุนงานช่างส่วนตัว
    </div>

  `);


  // ==================================================
  // PAGE 2
  // วัสดุ + ต้นทุน
  // ==================================================


  let materialRows = '';


  materials.forEach(item => {

    materialRows += `

      <tr>

        <td style="
          padding:13px 10px;
          border-bottom:1px solid #ddd;
        ">
          ${escapeHTML(item.name)}
        </td>


        <td style="
          padding:13px 10px;
          border-bottom:1px solid #ddd;
          text-align:center;
        ">
          ${item.typeText}
        </td>


        <td style="
          padding:13px 10px;
          border-bottom:1px solid #ddd;
          text-align:center;
        ">
          ${item.useText}
        </td>


        <td style="
          padding:13px 10px;
          border-bottom:1px solid #ddd;
          text-align:right;
          font-weight:700;
        ">
          ${item.cost}
        </td>

      </tr>

    `;

  });


  await createPDFPage(pdf,`

    <div style="
      border-bottom:4px solid #202124;
      padding-bottom:16px;
      margin-bottom:28px;
    ">

      <div style="
        font-size:28px;
        font-weight:800;
      ">
        ต้นทุนงาน
      </div>

      <div style="
        color:#777;
      ">
        ${escapeHTML(jobName)}
      </div>

    </div>


    <div style="
      font-size:22px;
      font-weight:800;
      margin-bottom:12px;
    ">
      วัสดุ
    </div>


    <table style="
      width:100%;
      border-collapse:collapse;
      font-size:14px;
      margin-bottom:35px;
    ">

      <thead>

        <tr style="
          background:#202124;
          color:#fff;
        ">

          <th style="
            padding:12px;
            text-align:left;
          ">
            วัสดุ
          </th>

          <th style="
            padding:12px;
            text-align:center;
          ">
            วิธีคิด
          </th>

          <th style="
            padding:12px;
            text-align:center;
          ">
            ใช้ไป
          </th>

          <th style="
            padding:12px;
            text-align:right;
          ">
            ต้นทุน
          </th>

        </tr>

      </thead>


      <tbody>

        ${materialRows}

      </tbody>

    </table>


    <div style="
      margin-left:auto;
      width:390px;
      border-top:3px solid #202124;
      padding-top:14px;
    ">


      <div style="
        display:flex;
        justify-content:space-between;
        padding:9px 0;
      ">

        <span>วัสดุ</span>

        <strong>${mat}</strong>

      </div>


      <div style="
        display:flex;
        justify-content:space-between;
        padding:9px 0;
      ">

        <span>ค่าแรง</span>

        <strong>${lab}</strong>

      </div>


      <div style="
        display:flex;
        justify-content:space-between;
        padding:12px 0;
        border-top:1px solid #ddd;
        font-size:20px;
      ">

        <strong>ต้นทุนรวม</strong>

        <strong>${total}</strong>

      </div>


      <div style="
        display:flex;
        justify-content:space-between;
        padding:10px 0;
      ">

        <strong>ราคาขาย</strong>

        <strong>${money(selling)}</strong>

      </div>


      <div style="
        display:flex;
        justify-content:space-between;
        align-items:center;
        background:#202124;
        color:#fff;
        border-radius:12px;
        padding:16px;
        margin-top:8px;
        font-size:22px;
      ">

        <strong>กำไร</strong>

        <strong>${profit}</strong>

      </div>


    </div>


    <div style="
      position:absolute;
      bottom:35px;
      left:42px;
      right:42px;
      border-top:1px solid #ddd;
      padding-top:8px;
      color:#999;
      font-size:11px;
    ">
      Cost Calculator • ${escapeHTML(jobName)}
    </div>

  `);

// ==================================================
// PAGE 3+
// รายละเอียดงาน
// 1 BOX = 1 PAGE
// ==================================================

for(
  let pageIndex = 0;
  pageIndex < detailPages.length;
  pageIndex++
){

  const detailText =
    detailPages[pageIndex];


  await createPDFPage(pdf,`

    <div style="
      border-bottom:4px solid #202124;
      padding-bottom:16px;
      margin-bottom:22px;
    ">

      <div style="
        font-size:28px;
        font-weight:800;
      ">
        รายละเอียดงาน
      </div>

      <div style="
        color:#777;
        margin-top:3px;
      ">
        ${escapeHTML(jobName)}
      </div>

    </div>


    <div style="
      border:1px solid #d8d8d8;
      border-radius:18px;
      background:#fafafa;
      padding:24px;
      height:930px;
      white-space:pre-wrap;
      overflow:hidden;
      font-size:16px;
      line-height:1.65;
    ">
      ${escapeHTML(detailText)}
    </div>


    <div style="
      position:absolute;
      bottom:35px;
      left:42px;
      right:42px;
      border-top:1px solid #ddd;
      padding-top:8px;
      color:#999;
      font-size:11px;
      display:flex;
      justify-content:space-between;
    ">

      <span>
        Cost Calculator • ${escapeHTML(jobName)}
      </span>

      <span>
        รายละเอียดหน้า ${pageIndex + 1}
      </span>

    </div>

  `);

}
  
  // ==================================================
  // SAVE
  // ==================================================

  let fileName =
    jobName
      .replace(/[\\/:*?"<>|]/g,'')
      .trim();


  if(!fileName)
    fileName = 'งาน';


  pdf.save(
    `${fileName}.pdf`
  );

});
